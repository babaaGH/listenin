interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  error
}) => {
  if (error) {
    return (
      <div className="glass rounded-squircle p-4 border border-red-500/30 bg-red-500/5">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-400 mb-1">Connection Error</h3>
            <p className="text-xs text-red-300/80 leading-relaxed">{error}</p>
            {error.includes('API key') && (
              <div className="mt-3 text-xs text-white/60">
                <p className="mb-2 font-semibold">Server Configuration Required:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-apple-blue hover:underline">Google AI Studio</a></li>
                  <li>Add to Vercel: Dashboard → Settings → Environment Variables</li>
                  <li>Key: <code className="bg-white/10 px-1 py-0.5 rounded">GEMINI_API_KEY</code> (no VITE_ prefix)</li>
                  <li>Value: Your API key</li>
                  <li>Redeploy your app</li>
                </ol>
                <p className="mt-2 text-white/40">🔒 Secure: API key stays on the server, never exposed to browsers</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="glass rounded-squircle p-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white/40" />
          <span className="text-sm text-white/60">AI transcription not connected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-squircle p-4">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm text-white/80">Gemini AI connected</span>
        <div className="ml-auto text-xs text-white/40">
          gemini-2.0-flash
        </div>
      </div>
    </div>
  );
};
