import { useState, useEffect, useCallback } from 'react';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useGeminiStreaming } from './hooks/useGeminiStreaming';
import { useGeminiSummary } from './hooks/useGeminiSummary';
import { PermissionScreen } from './components/PermissionScreen';
import { RecordingOrb } from './components/RecordingOrb';
import { Timer } from './components/Timer';
import { Waveform } from './components/Waveform';
import { RecordingControls } from './components/RecordingControls';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { SummaryDisplay } from './components/SummaryDisplay';
import { SummaryGenerating } from './components/SummaryGenerating';
import { ConnectionStatus } from './components/ConnectionStatus';
import { MeetingDetail } from './components/MeetingDetail/MeetingDetail';
import { Dashboard } from './components/Dashboard/Dashboard';
import { OfflineIndicator } from './components/OfflineIndicator';
import { InstallPrompt } from './components/InstallPrompt';
import type { MeetingSummary } from './types/meeting';

type ViewMode = 'transcript' | 'summary';
type AppScreen = 'dashboard' | 'recording' | 'detail';

function App() {
  const [audioState, audioControls] = useAudioRecorder();
  const [geminiState, geminiControls] = useGeminiStreaming();
  const summaryState = useGeminiSummary();
  const [savedAudioBlob, setSavedAudioBlob] = useState<Blob | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('transcript');
  const [appScreen, setAppScreen] = useState<AppScreen>('dashboard');
  const [currentSummary, setCurrentSummary] = useState<MeetingSummary | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<string>('general');

  // Connect to Gemini on mount
  useEffect(() => {
    audioControls.requestPermission();
    geminiControls.connect();
  }, []);

  // Handle audio data streaming to Gemini
  const handleAudioData = useCallback(async (audioData: Float32Array) => {
    if (geminiState.isConnected && !audioState.isPaused) {
      await geminiControls.sendAudioChunk(audioData);
    }
  }, [geminiState.isConnected, audioState.isPaused, geminiControls]);

  const handleStartRecording = async (framework: string) => {
    setSelectedFramework(framework);
    geminiControls.clearTranscript();
    summaryState.resetState();
    setViewMode('transcript');
    setAppScreen('recording');
    setCurrentSummary(null);
    await audioControls.startRecording(handleAudioData);
    setShowSuccess(false);
  };

  const handleStart = async () => {
    await audioControls.startRecording(handleAudioData);
  };

  const handleFinish = async () => {
    const blob = await audioControls.stopRecording();
    if (blob) {
      setSavedAudioBlob(blob);
      setShowSuccess(true);

      // Auto-generate summary after recording stops
      if (geminiState.fullTranscript && geminiState.fullTranscript.length > 50) {
        setViewMode('summary');
        await summaryState.generateSummary(
          geminiState.fullTranscript,
          audioState.duration,
          selectedFramework
        );

        // Switch to detail screen when summary is ready
        if (summaryState.summary) {
          setCurrentSummary(summaryState.summary);
          setAppScreen('detail');
        }
      }

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  const handleBackToDashboard = () => {
    setAppScreen('dashboard');
    setViewMode('transcript');
    setCurrentSummary(null);
  };

  const handleOpenMeeting = (summary: MeetingSummary) => {
    setCurrentSummary(summary);
    setAppScreen('detail');
  };

  const handleSummaryUpdate = (updatedSummary: MeetingSummary) => {
    setCurrentSummary(updatedSummary);
  };

  // Watch for summary completion and switch to detail screen
  useEffect(() => {
    if (summaryState.summary && !summaryState.isGenerating) {
      setCurrentSummary(summaryState.summary);
      setAppScreen('detail');
    }
  }, [summaryState.summary, summaryState.isGenerating]);

  if (audioState.hasPermission === false || audioState.hasPermission === null) {
    return (
      <>
        <OfflineIndicator />
        <PermissionScreen
          onRequestPermission={audioControls.requestPermission}
          error={audioState.error}
        />
      </>
    );
  }

  // Show dashboard screen
  if (appScreen === 'dashboard') {
    return (
      <>
        <OfflineIndicator />
        <InstallPrompt />
        <Dashboard
          onStartRecording={handleStartRecording}
          onOpenMeeting={handleOpenMeeting}
        />
      </>
    );
  }

  // Show detail screen when summary is ready
  if (appScreen === 'detail' && currentSummary) {
    return (
      <>
        <OfflineIndicator />
        <MeetingDetail
          summary={currentSummary}
          onClose={handleBackToDashboard}
          onSummaryUpdate={handleSummaryUpdate}
        />
      </>
    );
  }

  return (
    <>
      <OfflineIndicator />
      <div className="min-h-screen flex flex-col">
        {/* Header */}
      <header className="glass fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">ListenIn</h1>
            {savedAudioBlob && (
              <div className="text-sm text-white/60">
                Recording saved ({(savedAudioBlob.size / 1024).toFixed(0)} KB)
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex px-6 pt-24 pb-12 gap-8">
        {/* Left Side - Recording Interface */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl space-y-12">
            {/* Success Message */}
            {showSuccess && (
              <div className="glass rounded-squircle p-4 text-center animate-in fade-in slide-in-from-top-5 duration-500">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Recording saved! Generating AI summary...</span>
                </div>
              </div>
            )}

            {/* Connection Status */}
            <ConnectionStatus
              isConnected={geminiState.isConnected}
              error={geminiState.error || summaryState.error}
            />

            {/* Timer */}
            {audioState.isRecording && (
              <div className="animate-in fade-in slide-in-from-top-5 duration-300">
                <Timer duration={audioState.duration} />
              </div>
            )}

            {/* Recording Orb */}
            <div className="flex justify-center">
              <RecordingOrb
                isRecording={audioState.isRecording}
                isPaused={audioState.isPaused}
                audioLevel={audioState.audioLevel}
              />
            </div>

            {/* Waveform */}
            <Waveform
              audioLevel={audioState.audioLevel}
              isActive={audioState.isRecording && !audioState.isPaused}
            />

            {/* Controls */}
            <RecordingControls
              isRecording={audioState.isRecording}
              isPaused={audioState.isPaused}
              onStart={handleStart}
              onPause={audioControls.pauseRecording}
              onResume={audioControls.resumeRecording}
              onFinish={handleFinish}
            />

            {/* Status */}
            {audioState.isRecording && (
              <div className="text-center space-y-2 animate-in fade-in duration-500">
                <p className="text-sm text-white/60">
                  {audioState.isPaused ? 'Recording paused' : 'Recording in progress...'}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-white/40">
                  <div className={`w-2 h-2 rounded-full ${audioState.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                  <span>16kHz PCM Mono</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Transcript/Summary Display */}
        <div className="flex-1 max-w-2xl">
          <div className="glass rounded-squircle h-full min-h-[600px] flex flex-col">
            {/* View Toggle Header */}
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('transcript')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium smooth-transition ${
                      viewMode === 'transcript'
                        ? 'bg-apple-blue text-white'
                        : 'text-white/60 hover:bg-white/10'
                    }`}
                  >
                    Live Transcript
                  </button>
                  <button
                    onClick={() => setViewMode('summary')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium smooth-transition ${
                      viewMode === 'summary'
                        ? 'bg-apple-blue text-white'
                        : 'text-white/60 hover:bg-white/10'
                    } ${!summaryState.summary && !summaryState.isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!summaryState.summary && !summaryState.isGenerating}
                  >
                    AI Summary
                    {summaryState.isGenerating && (
                      <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </button>
                </div>
                {viewMode === 'transcript' && geminiState.transcriptChunks.length > 0 && (
                  <div className="text-xs text-white/40">
                    {geminiState.transcriptChunks.length} chunks
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative">
              {viewMode === 'transcript' && (
                <TranscriptDisplay
                  chunks={geminiState.transcriptChunks}
                  isStreaming={geminiState.isStreaming}
                />
              )}

              {viewMode === 'summary' && (
                <>
                  {summaryState.isGenerating && (
                    <SummaryGenerating progress={summaryState.progress} />
                  )}
                  {!summaryState.isGenerating && summaryState.summary && (
                    <SummaryDisplay summary={summaryState.summary} />
                  )}
                  {!summaryState.isGenerating && !summaryState.summary && (
                    <div className="h-full flex items-center justify-center text-white/40 text-sm">
                      <div className="text-center space-y-2">
                        <svg className="w-12 h-12 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No summary available</p>
                        <p className="text-xs">Record a meeting to generate an AI summary</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-white/30">
        <p>Powered by Gemini 2.0 Flash</p>
      </footer>
      </div>
    </>
  );
}

export default App;
