import { useEffect, useState } from 'react';

interface WaveformProps {
  audioLevel: number;
  isActive: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ audioLevel, isActive }) => {
  const [bars, setBars] = useState<number[]>(new Array(40).fill(0));

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setBars(prev => {
          const newBars = [...prev];
          newBars.shift();
          newBars.push(audioLevel);
          return newBars;
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      setBars(new Array(40).fill(0));
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
              className="flex-1 bg-apple-blue rounded-full smooth-transition"
              style={{
                height: `${height}px`,
                opacity: opacity,
                minWidth: '3px',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
