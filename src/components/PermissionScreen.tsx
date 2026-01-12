interface PermissionScreenProps {
  onRequestPermission: () => void;
  error: string | null;
}

export const PermissionScreen: React.FC<PermissionScreenProps> = ({
  onRequestPermission,
  error
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center shadow-2xl shadow-apple-blue/30">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold">ListenIn</h1>
          <p className="text-lg text-white/70">
            Meeting intelligence powered by AI
          </p>
        </div>

        {/* Description */}
        <div className="glass rounded-squircle p-6 space-y-4">
          <h2 className="text-xl font-medium">Microphone Access Required</h2>
          <p className="text-white/70 leading-relaxed">
            ListenIn needs access to your microphone to record audio for transcription and analysis.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-squircle p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Button */}
        <button
          onClick={onRequestPermission}
          className="ios-button-primary text-lg px-12 py-4 w-full"
        >
          Enable Microphone
        </button>

        {/* Footer */}
        <p className="text-xs text-white/40">
          Your recordings are processed locally and only sent to Gemini API for transcription
        </p>
      </div>
    </div>
  );
};
