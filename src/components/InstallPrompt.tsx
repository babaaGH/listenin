import { useState, useEffect } from 'react';

export const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    // Show prompt if: iOS device, not standalone, and not dismissed in last 7 days
    if (iOS && !standalone && dismissedTime < sevenDaysAgo) {
      // Show after 3 seconds to not interrupt initial experience
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install-prompt-dismissed', Date.now().toString());
  };

  if (!showPrompt || !isIOS || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        onClick={handleDismiss}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-oled-black border border-white/10 sm:rounded-squircle rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-500">
        {/* Handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center shadow-2xl shadow-apple-blue/50">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-center mb-2">
            Install ListenIn
          </h2>

          {/* Description */}
          <p className="text-sm text-white/60 text-center mb-6">
            Add ListenIn to your home screen for the best experience. Access it like a native app with offline support.
          </p>

          {/* Instructions */}
          <div className="glass rounded-xl p-4 mb-6">
            <p className="text-sm text-white/80 mb-3 font-medium">Installation steps:</p>
            <ol className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-apple-blue/20 text-apple-blue flex items-center justify-center text-xs font-semibold">
                  1
                </span>
                <span>
                  Tap the <span className="font-semibold">Share</span> button{' '}
                  <svg className="inline w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  in Safari
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-apple-blue/20 text-apple-blue flex items-center justify-center text-xs font-semibold">
                  2
                </span>
                <span>
                  Scroll down and tap{' '}
                  <span className="font-semibold">"Add to Home Screen"</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-apple-blue/20 text-apple-blue flex items-center justify-center text-xs font-semibold">
                  3
                </span>
                <span>Tap <span className="font-semibold">"Add"</span> to confirm</span>
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 smooth-transition text-white font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-3 rounded-xl bg-apple-blue hover:bg-blue-600 smooth-transition text-white font-semibold"
            >
              Got It
            </button>
          </div>
        </div>

        {/* Safe area for iPhone notch */}
        <div className="h-safe-bottom sm:hidden" />
      </div>
    </div>
  );
};
