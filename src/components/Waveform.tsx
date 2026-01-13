import { useEffect, useState, useRef } from 'react';

interface WaveformProps {
  audioLevel: number;
  isActive: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ audioLevel, isActive }) => {
  const [bars, setBars] = useState<number[]>(new Array(40).fill(0));
  const lastUpdateRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      let currentAudioLevel = audioLevel;

      const animate = (timestamp: number) => {
        // Update every ~50ms (20fps for waveform - smooth enough while performant)
        if (timestamp - lastUpdateRef.current >= 50) {
          setBars(prev => {
            const newBars = [...prev];
            newBars.shift();
            newBars.push(currentAudioLevel);
            return newBars;
          });
          lastUpdateRef.current = timestamp;
        }

        rafIdRef.current = requestAnimationFrame(animate);
      };

      rafIdRef.current = requestAnimationFrame(animate);

      return () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    } else {
      // Smoothly fade out bars when inactive
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      setBars(new Array(40).fill(0));
    }
  }, [isActive]);

  // Update current audio level for next animation frame
  useEffect(() => {
    if (isActive && audioLevel !== undefined) {
      // Store latest audio level for next animation frame
    }
  }, [audioLevel, isActive]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-center gap-1 h-24">
        {bars.map((level, index) => {
          const height = Math.max(4, level * 80);
          const opacity = isActive ? 0.3 + (level * 0.7) : 0.1;

          return (
            <div
              key={index}
              className="flex-1 bg-apple-blue rounded-full"
              style={{
                height: `${height}px`,
                opacity: opacity,
                minWidth: '3px',
                transition: 'height 0.1s ease-out, opacity 0.15s ease-out',
                willChange: isActive ? 'height, opacity' : 'auto'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
