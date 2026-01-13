import { useState } from 'react';

export const ModelTest: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/list-models');
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="glass rounded-squircle max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Gemini Models</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 smooth-transition flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!result && !loading && !error && (
            <div className="text-center py-12">
              <p className="text-white/60 mb-6">Click the button below to check which Gemini models are available for your API key.</p>
              <button
                onClick={testModels}
                className="px-6 py-3 bg-apple-blue rounded-lg font-medium hover:bg-apple-blue/80 smooth-transition"
              >
                Test Models
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white/60">Checking available models...</p>
            </div>
          )}

          {error && (
            <div className="glass rounded-lg p-6 bg-red-500/10 border border-red-500/20">
              <h3 className="text-red-400 font-semibold mb-2">Error</h3>
              <p className="text-white/80 text-sm font-mono">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="glass rounded-lg p-4 bg-green-500/10 border border-green-500/20">
                <p className="text-green-400 font-semibold">
                  ✓ Found {result.count} models
                </p>
              </div>

              <div className="space-y-3">
                {result.models?.map((model: any) => (
                  <div key={model.name} className="glass rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-apple-blue">{model.name}</h3>
                        <p className="text-sm text-white/60">{model.displayName}</p>
                      </div>
                    </div>
                    {model.description && (
                      <p className="text-xs text-white/50 mb-2">{model.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {model.supportedGenerationMethods?.map((method: string) => (
                        <span
                          key={method}
                          className="text-xs px-2 py-1 rounded bg-white/10 text-white/70"
                        >
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass rounded-lg p-4 mt-6">
                <h3 className="font-semibold mb-2">Full Response (for debugging)</h3>
                <pre className="text-xs text-white/60 overflow-x-auto bg-black/30 p-3 rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
