import { useEffect, useState } from 'react';

interface RecordingOrbProps {
  isRecording: boolean;
  isPaused: boolean;
  audioLevel: number;
}

export const RecordingOrb: React.FC<RecordingOrbProps> = ({
  isRecording,
  isPaused,
  audioLevel
}) => {
  const [pulseRings, setPulseRings] = useState<number[]>([]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      const interval = setInterval(() => {
        setPulseRings(prev => [...prev, Date.now()]);
      }, 2000);

      return () => clearInterval(interval);
    } else {
      setPulseRings([]);
    }
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (pulseRings.length > 0) {
      const timeout = setTimeout(() => {
        setPulseRings(prev => prev.slice(1));
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [pulseRings]);

  const orbScale = isPaused ? 0.9 : 1 + (audioLevel * 0.3);
  const orbOpacity = isPaused ? 0.5 : 0.9 + (audioLevel * 0.1);

  return (
    <div className="relative flex items-center justify-center w-80 h-80">
      {/* Pulse rings */}
      {isRecording && !isPaused && pulseRings.map((id) => (
        <div
          key={id}
          className="absolute inset-0 rounded-full border-2 border-apple-blue pulse-ring"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      ))}

      {/* Main orb */}
      <div
        className={`relative w-64 h-64 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 shadow-2xl shadow-apple-blue/50 smooth-transition ${
          !isPaused && isRecording ? 'breathe' : ''
        }`}
        style={{
          transform: `scale(${orbScale})`,
          opacity: orbOpacity,
        }}
      >
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-white/10" />

        {/* Center highlight */}
        <div className="absolute top-12 left-12 w-20 h-20 rounded-full bg-white/20 blur-2xl" />

        {/* Status indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isPaused ? (
            <div className="flex gap-2">
              <div className="w-3 h-12 bg-white rounded-full" />
              <div className="w-3 h-12 bg-white rounded-full" />
            </div>
          ) : isRecording ? (
            <div className="w-16 h-16 rounded-full border-4 border-white animate-spin border-t-transparent" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white" />
          )}
        </div>
      </div>

      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-white/20"
        style={{
          width: 'calc(100% - 2rem)',
          height: 'calc(100% - 2rem)',
          left: '1rem',
          top: '1rem',
        }}
      />
    </div>
  );
};
