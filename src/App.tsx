import { useState, useEffect, useCallback } from 'react';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useGeminiStreaming } from './hooks/useGeminiStreaming';
import { PermissionScreen } from './components/PermissionScreen';
import { RecordingOrb } from './components/RecordingOrb';
import { Timer } from './components/Timer';
import { Waveform } from './components/Waveform';
import { RecordingControls } from './components/RecordingControls';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { ConnectionStatus } from './components/ConnectionStatus';

function App() {
  const [audioState, audioControls] = useAudioRecorder();
  const [geminiState, geminiControls] = useGeminiStreaming();
  const [savedAudioBlob, setSavedAudioBlob] = useState<Blob | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleStart = async () => {
    geminiControls.clearTranscript();
    await audioControls.startRecording(handleAudioData);
    setShowSuccess(false);
  };

  const handleFinish = async () => {
    const blob = await audioControls.stopRecording();
    if (blob) {
      setSavedAudioBlob(blob);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  if (audioState.hasPermission === false || audioState.hasPermission === null) {
    return (
      <PermissionScreen
        onRequestPermission={audioControls.requestPermission}
        error={audioState.error}
      />
    );
  }

  return (
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
                  <span className="font-medium">Recording saved successfully</span>
                </div>
              </div>
            )}

            {/* Connection Status */}
            <ConnectionStatus
              isConnected={geminiState.isConnected}
              error={geminiState.error}
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

        {/* Right Side - Transcript Display */}
        <div className="flex-1 max-w-2xl">
          <div className="glass rounded-squircle h-full min-h-[600px] flex flex-col">
            {/* Transcript Header */}
            <div className="px-6 py-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Live Transcript</h2>
                {geminiState.transcriptChunks.length > 0 && (
                  <div className="text-xs text-white/40">
                    {geminiState.transcriptChunks.length} chunks
                  </div>
                )}
              </div>
            </div>

            {/* Transcript Content */}
            <div className="flex-1 relative">
              <TranscriptDisplay
                chunks={geminiState.transcriptChunks}
                isStreaming={geminiState.isStreaming}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-white/30">
        <p>Powered by Gemini 2.0 Flash</p>
      </footer>
    </div>
  );
}

export default App;
