import { useState, useEffect } from 'react';
import { storageManager } from '../utils/storage';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  useEffect(() => {
    // Load saved API key (if user wants to use their own)
    const savedKey = localStorage.getItem('user_gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme !== 'light');
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('user_gemini_api_key', apiKey.trim());
      alert('API key saved! The app will use your key for future requests.');
    } else {
      localStorage.removeItem('user_gemini_api_key');
      alert('API key removed. Using default server-side key.');
    }
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('light-mode', !newTheme);
  };

  const handleExportData = () => {
    const meetings = storageManager.getAllSummaries();
    const dataStr = JSON.stringify(meetings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `listenin-meetings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 2000);
  };

  const handleClearAllData = () => {
    localStorage.clear();
    setShowDeleteConfirm(false);
    alert('All data cleared! The app will reload.');
    window.location.reload();
  };

  const getStorageUsage = () => {
    const meetings = storageManager.getAllSummaries();
    const sizeInBytes = new Blob([JSON.stringify(meetings)]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    return sizeInKB;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-oled-black border border-white/10 sm:rounded-squircle rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-y-auto">
        {/* Handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-2 sticky top-0 bg-oled-black z-10">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 sticky top-6 sm:top-0 bg-oled-black z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Settings</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 smooth-transition flex items-center justify-center"
              aria-label="Close settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <section className="glass rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-apple-blue/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Gemini API Key</h3>
                <p className="text-sm text-white/60 mb-3">
                  Optional: Use your own Gemini API key instead of the default server key. Get one at{' '}
                  <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-apple-blue hover:underline">
                    makersuite.google.com
                  </a>
                </p>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key here (optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-apple-blue smooth-transition mb-3"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2 bg-apple-blue hover:bg-blue-600 rounded-lg text-white font-medium smooth-transition"
                >
                  Save API Key
                </button>
              </div>
            </div>
          </section>

          {/* Theme Section */}
          <section className="glass rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Dark Mode (OLED)</h3>
                  <p className="text-sm text-white/60">True black background for OLED displays</p>
                </div>
              </div>
              <button
                onClick={handleThemeToggle}
                className={`relative w-14 h-8 rounded-full smooth-transition ${isDarkMode ? 'bg-apple-blue' : 'bg-white/20'}`}
                aria-label="Toggle dark mode"
              >
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-white smooth-transition ${isDarkMode ? 'right-1' : 'left-1'}`}
                />
              </button>
            </div>
          </section>

          {/* Data Management Section */}
          <section className="glass rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Data Management</h3>
                <p className="text-sm text-white/60">
                  Storage used: {getStorageUsage()} KB
                  {' · '}
                  {storageManager.getAllSummaries().length} meetings saved
                </p>
              </div>
            </div>

            {/* Export Data */}
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg smooth-transition"
            >
              <svg className="w-5 h-5 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <div className="flex-1 text-left">
                <div className="font-medium">Export Meeting Data</div>
                <div className="text-xs text-white/60">Download all meetings as JSON</div>
              </div>
              {showExportSuccess && (
                <span className="text-green-400 text-sm">✓ Exported</span>
              )}
            </button>

            {/* Clear All Data */}
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg smooth-transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <div className="flex-1 text-left">
                  <div className="font-medium">Clear All Data</div>
                  <div className="text-xs text-red-400/60">Delete all meetings and settings</div>
                </div>
              </button>
            ) : (
              <div className="space-y-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-medium text-sm">Are you sure?</p>
                <p className="text-red-400/80 text-xs">This will permanently delete all your meetings and cannot be undone.</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-white font-medium smooth-transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAllData}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium smooth-transition"
                  >
                    Delete All
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* About Section */}
          <section className="glass rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">ℹ️</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">About ListenIn</h3>
                <p className="text-sm text-white/60 mb-2">
                  Version 1.0.0 · Built with React + Gemini AI
                </p>
                <p className="text-xs text-white/40">
                  © 2026 ListenIn · Powered by Gemini 2.0 Flash
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Safe area for iPhone notch */}
        <div className="h-safe-bottom sm:hidden" />
      </div>
    </div>
  );
};
