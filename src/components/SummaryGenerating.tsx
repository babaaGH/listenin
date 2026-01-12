interface SummaryGeneratingProps {
  progress: number;
}

export const SummaryGenerating: React.FC<SummaryGeneratingProps> = ({ progress }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      {/* Animated AI Icon */}
      <div className="mb-8">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-oled-black flex items-center justify-center">
            <svg className="w-12 h-12 text-apple-blue animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Status Text */}
      <h3 className="text-xl font-semibold mb-2">Generating AI Summary</h3>
      <p className="text-white/60 mb-6 max-w-md">
        Analyzing your meeting with Gemini 2.0 Pro...
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-md mb-4">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-apple-blue to-blue-600 smooth-transition"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress Text */}
      <p className="text-sm text-white/40">{progress}% complete</p>

      {/* Steps Indicator */}
      <div className="mt-8 space-y-2 text-sm text-white/60">
        <div className={`flex items-center gap-2 ${progress >= 30 ? 'text-apple-blue' : ''}`}>
          {progress >= 30 ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-current animate-pulse" />
          )}
          Processing transcript
        </div>
        <div className={`flex items-center gap-2 ${progress >= 70 ? 'text-apple-blue' : ''}`}>
          {progress >= 70 ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-current animate-pulse" />
          )}
          Generating structured summary
        </div>
        <div className={`flex items-center gap-2 ${progress >= 90 ? 'text-apple-blue' : ''}`}>
          {progress >= 90 ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-current animate-pulse" />
          )}
          Saving results
        </div>
      </div>
    </div>
  );
};
