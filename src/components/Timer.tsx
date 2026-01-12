interface TimerProps {
  duration: number;
}

export const Timer: React.FC<TimerProps> = ({ duration }) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="text-center">
      <div className="text-6xl font-light tracking-wider tabular-nums">
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>
      <div className="text-sm text-white/50 mt-2 uppercase tracking-widest">
        Recording Time
      </div>
    </div>
  );
};
