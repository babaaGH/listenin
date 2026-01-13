import { useState, useCallback } from 'react';
import type { MeetingSummary, SummaryGenerationState } from '../types/meeting';
import { storageManager } from '../utils/storage';

export const useGeminiSummary = () => {
  const [state, setState] = useState<SummaryGenerationState>({
    isGenerating: false,
    progress: 0,
    error: null,
    summary: null,
  });

  const generateSummary = useCallback(async (
    transcript: string,
    duration: number,
    framework: string = 'general'
  ): Promise<MeetingSummary | null> => {
    if (!transcript || transcript.length < 50) {
      setState(prev => ({
        ...prev,
        error: 'Transcript too short for summary generation'
      }));
      return null;
    }

    setState({
      isGenerating: true,
      progress: 10,
      error: null,
      summary: null,
    });

    try {
      // Format duration as MM:SS
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const durationStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      setState(prev => ({ ...prev, progress: 30 }));

      // Call backend API
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          duration: durationStr,
          framework
        }),
      });

      setState(prev => ({ ...prev, progress: 70 }));

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate summary');
      }

      const data = await response.json();

      if (!data.success || !data.summary) {
        throw new Error('Invalid response from server');
      }

      setState(prev => ({ ...prev, progress: 90 }));

      // Create full meeting summary with metadata
      const meetingSummary: MeetingSummary = {
        id: `meeting_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        overview: data.summary.overview,
        chapters: data.summary.chapters || [],
        highlights: data.summary.highlights || [],
        actionItems: (data.summary.actionItems || []).map((item: any) => ({
          ...item,
          completed: false
        })),
        participants: data.summary.participants || [],
        duration: durationStr,
        recordedAt: new Date().toISOString(),
        transcript: transcript
      };

      // Save to localStorage
      storageManager.saveSummary(meetingSummary);

      setState({
        isGenerating: false,
        progress: 100,
        error: null,
        summary: meetingSummary,
      });

      return meetingSummary;

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to generate summary';

      setState({
        isGenerating: false,
        progress: 0,
        error: errorMessage,
        summary: null,
      });

      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      isGenerating: false,
      progress: 0,
      error: null,
      summary: null,
    });
  }, []);

  return {
    ...state,
    generateSummary,
    clearError,
    resetState,
  };
};
