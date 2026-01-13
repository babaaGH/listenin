interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 shadow-2xl shadow-apple-blue/50 flex items-center justify-center smooth-transition hover:scale-110 active:scale-95 z-30"
      aria-label="Start recording"
    >
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
      </svg>

      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-apple-blue animate-ping opacity-20" />
    </button>
  );
};
