interface EmptyStateProps {
  onStartRecording: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onStartRecording }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Illustration */}
      <div className="relative mb-8">
        {/* Microphone Icon */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center shadow-2xl shadow-apple-blue/30 animate-in zoom-in duration-500">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Pulse Rings */}
        <div className="absolute inset-0 rounded-full bg-apple-blue animate-ping opacity-20" />
        <div className="absolute inset-0 rounded-full bg-apple-blue animate-pulse opacity-10" />
      </div>

      {/* Text Content */}
      <h2 className="text-2xl font-semibold mb-3 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
        No meetings yet
      </h2>
      <p className="text-white/60 mb-8 max-w-md animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
        Start recording your first meeting to capture insights, action items, and key moments with AI-powered analysis.
      </p>

      {/* CTA Button */}
      <button
        onClick={onStartRecording}
        className="px-8 py-4 bg-gradient-to-r from-apple-blue to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-apple-blue/30 hover:shadow-xl hover:shadow-apple-blue/40 smooth-transition hover:scale-105 active:scale-95 animate-in slide-in-from-bottom-4 duration-500"
        style={{ animationDelay: '400ms' }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
          <span>Start Your First Recording</span>
        </div>
      </button>

      {/* Feature Highlights */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl animate-in fade-in duration-700" style={{ animationDelay: '600ms' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-sm font-semibold mb-1">Smart Analysis</h3>
          <p className="text-xs text-white/60">AI-powered insights and summaries</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-sm font-semibold mb-1">Action Items</h3>
          <p className="text-xs text-white/60">Never miss a follow-up task</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-sm font-semibold mb-1">Intel Chat</h3>
          <p className="text-xs text-white/60">Ask questions about any meeting</p>
        </div>
      </div>
    </div>
  );
};
