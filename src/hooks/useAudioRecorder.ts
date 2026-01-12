import { useState, useRef, useCallback, useEffect } from 'react';

export interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevel: number;
  hasPermission: boolean | null;
  error: string | null;
}

export interface AudioRecorderControls {
  startRecording: (onAudioData?: (data: Float32Array) => void) => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  requestPermission: () => Promise<boolean>;
}

export const useAudioRecorder = (): [AudioRecorderState, AudioRecorderControls] => {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0,
    hasPermission: null,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const onAudioDataRef = useRef<((data: Float32Array) => void) | null>(null);
  const timerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      stream.getTracks().forEach(track => track.stop());

      setState(prev => ({ ...prev, hasPermission: true, error: null }));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get microphone permission';
      setState(prev => ({
        ...prev,
        hasPermission: false,
        error: errorMessage
      }));
      return false;
    }
  }, []);

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1);

    setState(prev => ({ ...prev, audioLevel: normalizedLevel }));

    if (state.isRecording && !state.isPaused) {
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [state.isRecording, state.isPaused]);

  const startRecording = useCallback(async (onAudioData?: (data: Float32Array) => void) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      streamRef.current = stream;
      audioChunksRef.current = [];
      onAudioDataRef.current = onAudioData || null;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Add ScriptProcessorNode for real-time audio data streaming
      if (onAudioData) {
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (state.isPaused || !onAudioDataRef.current) return;

          const inputData = e.inputBuffer.getChannelData(0);
          const audioData = new Float32Array(inputData);
          onAudioDataRef.current(audioData);
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;

      timerRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current;
        setState(prev => ({ ...prev, duration: Math.floor(elapsed / 1000) }));
      }, 1000);

      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        error: null
      }));

      updateAudioLevel();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start recording';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, [updateAudioLevel, state.isPaused]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || state.isRecording === false) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        resolve(blob);
      };

      mediaRecorderRef.current.stop();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      onAudioDataRef.current = null;

      setState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        audioLevel: 0
      }));
    });
  }, [state.isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause();
      pausedTimeRef.current = Date.now() - startTimeRef.current;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      setState(prev => ({ ...prev, isPaused: true, audioLevel: 0 }));
    }
  }, [state.isRecording, state.isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume();
      startTimeRef.current = Date.now() - pausedTimeRef.current;

      setState(prev => ({ ...prev, isPaused: false }));
      updateAudioLevel();
    }
  }, [state.isRecording, state.isPaused, updateAudioLevel]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return [
    state,
    {
      startRecording,
      stopRecording,
      pauseRecording,
      resumeRecording,
      requestPermission,
    }
  ];
};
