import { useEffect } from 'react';

interface Framework {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface FrameworkSelectorProps {
  onSelect: (frameworkId: string) => void;
  onClose: () => void;
}

export const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({ onSelect, onClose }) => {
  const frameworks: Framework[] = [
    {
      id: 'sales',
      name: 'Sales Call',
      icon: '💼',
      description: 'Track objections, commitments, and next steps',
    },
    {
      id: 'one-on-one',
      name: '1:1 Meeting',
      icon: '🤝',
      description: 'Focus on feedback, goals, and action items',
    },
    {
      id: 'standup',
      name: 'Standup',
      icon: '⚡',
      description: 'Quick updates, blockers, and daily goals',
    },
    {
      id: 'brainstorm',
      name: 'Brainstorm',
      icon: '💡',
      description: 'Capture ideas, decisions, and creative solutions',
    },
    {
      id: 'general',
      name: 'General',
      icon: '📝',
      description: 'Standard meeting analysis and summary',
    },
  ];

  const handleSelect = (frameworkId: string) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    onSelect(frameworkId);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-oled-black border border-white/10 sm:rounded-squircle rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-500 ease-out">
        {/* Handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Choose Meeting Type</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 smooth-transition flex items-center justify-center"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-white/60 mt-1">
            Select a framework to optimize your meeting analysis
          </p>
        </div>

        {/* Framework Cards */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {frameworks.map((framework, index) => (
            <button
              key={framework.id}
              onClick={() => handleSelect(framework.id)}
              className="w-full glass rounded-xl p-5 text-left hover:bg-white/10 smooth-transition active:scale-[0.98] animate-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center text-2xl">
                  {framework.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-1">{framework.name}</h3>
                  <p className="text-sm text-white/60">{framework.description}</p>
                </div>

                {/* Chevron */}
                <div className="flex-shrink-0 text-white/40">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer (mobile safe area) */}
        <div className="h-safe-bottom sm:hidden" />
      </div>
    </div>
  );
};
