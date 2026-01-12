import { useState, useRef, useCallback } from 'react';

export interface TranscriptChunk {
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export interface GeminiStreamingState {
  isConnected: boolean;
  isStreaming: boolean;
  transcriptChunks: TranscriptChunk[];
  fullTranscript: string;
  error: string | null;
}

export interface GeminiStreamingControls {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  sendAudioChunk: (audioData: Float32Array) => Promise<void>;
  clearTranscript: () => void;
}

export const useGeminiStreaming = (): [GeminiStreamingState, GeminiStreamingControls] => {
  const [state, setState] = useState<GeminiStreamingState>({
    isConnected: false,
    isStreaming: false,
    transcriptChunks: [],
    fullTranscript: '',
    error: null,
  });

  const isFirstChunkRef = useRef<boolean>(true);
  const startTimeRef = useRef<number>(0);

  const connect = useCallback(async (): Promise<boolean> => {
    try {
      // Test connection to backend proxy
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: '', // Empty test request
          isFirst: true
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to connect to transcription service');
      }

      startTimeRef.current = Date.now();

      setState(prev => ({
        ...prev,
        isConnected: true,
        error: null,
      }));

      return true;
    } catch (err) {
      let errorMessage = 'Failed to connect to transcription service';

      if (err instanceof Error) {
        if (err.message.includes('API key')) {
          errorMessage = 'Server configuration error: API key not configured. Please contact the administrator.';
        } else {
          errorMessage = err.message;
        }
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isConnected: false,
      }));
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    isFirstChunkRef.current = true;

    setState(prev => ({
      ...prev,
      isConnected: false,
      isStreaming: false,
    }));
  }, []);

  const sendAudioChunk = useCallback(async (audioData: Float32Array) => {
    if (!state.isConnected) {
      return;
    }

    try {
      setState(prev => ({ ...prev, isStreaming: true }));

      // Convert Float32Array to base64 PCM
      const pcmData = new Int16Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        pcmData[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32768));
      }

      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(pcmData.buffer))
      );

      // Call backend proxy
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: base64Audio,
          isFirst: isFirstChunkRef.current
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Transcription failed');
      }

      const data = await response.json();
      const transcriptText = data.transcript || '';

      if (transcriptText) {
        const timestamp = Date.now() - startTimeRef.current;
        const newChunk: TranscriptChunk = {
          text: transcriptText,
          timestamp,
          isFinal: true,
        };

        setState(prev => ({
          ...prev,
          transcriptChunks: [...prev.transcriptChunks, newChunk],
          fullTranscript: prev.fullTranscript + transcriptText,
        }));

        isFirstChunkRef.current = false;
      }

    } catch (err) {
      let errorMessage = 'Failed to process audio';

      if (err instanceof Error) {
        if (err.message.includes('quota')) {
          errorMessage = 'API quota exceeded. Please try again later.';
        } else if (err.message.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded. Please slow down.';
        } else {
          errorMessage = err.message;
        }
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
    } finally {
      setState(prev => ({ ...prev, isStreaming: false }));
    }
  }, [state.isConnected]);

  const clearTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcriptChunks: [],
      fullTranscript: '',
    }));
    startTimeRef.current = Date.now();
    isFirstChunkRef.current = true;
  }, []);

  return [
    state,
    {
      connect,
      disconnect,
      sendAudioChunk,
      clearTranscript,
    },
  ];
};
