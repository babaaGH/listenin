import { useState, useRef, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

  const genAIRef = useRef<GoogleGenerativeAI | null>(null);
  const modelRef = useRef<any>(null);
  const chatRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  const connect = useCallback(async (): Promise<boolean> => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        setState(prev => ({
          ...prev,
          error: 'Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables.'
        }));
        return false;
      }

      genAIRef.current = new GoogleGenerativeAI(apiKey);

      // Use Gemini 2.0 Flash for audio streaming
      modelRef.current = genAIRef.current.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
      });

      startTimeRef.current = Date.now();

      setState(prev => ({
        ...prev,
        isConnected: true,
        error: null,
      }));

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Gemini API';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isConnected: false,
      }));
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    chatRef.current = null;
    modelRef.current = null;
    genAIRef.current = null;

    setState(prev => ({
      ...prev,
      isConnected: false,
      isStreaming: false,
    }));
  }, []);

  const sendAudioChunk = useCallback(async (audioData: Float32Array) => {
    if (!modelRef.current || !state.isConnected) {
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

      const prompt = chatRef.current
        ? 'Continue transcribing:'
        : 'Transcribe this audio in real-time. Only output the spoken words, no formatting or explanations:';

      const result = await modelRef.current.generateContentStream([
        {
          inlineData: {
            mimeType: 'audio/pcm',
            data: base64Audio,
          },
        },
        { text: prompt },
      ]);

      let accumulatedText = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          accumulatedText += chunkText;

          const timestamp = Date.now() - startTimeRef.current;
          const newChunk: TranscriptChunk = {
            text: chunkText,
            timestamp,
            isFinal: false,
          };

          setState(prev => ({
            ...prev,
            transcriptChunks: [...prev.transcriptChunks, newChunk],
            fullTranscript: prev.fullTranscript + chunkText,
          }));
        }
      }

      // Mark the final chunk
      if (accumulatedText) {
        setState(prev => {
          const chunks = [...prev.transcriptChunks];
          if (chunks.length > 0) {
            chunks[chunks.length - 1].isFinal = true;
          }
          return { ...prev, transcriptChunks: chunks };
        });
      }

      chatRef.current = true; // Mark that we've started a session

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process audio';
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
