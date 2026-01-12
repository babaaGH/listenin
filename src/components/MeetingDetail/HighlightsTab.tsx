import { useState } from 'react';
import type { MeetingHighlight } from '../../types/meeting';

interface HighlightsTabProps {
  highlights: MeetingHighlight[];
}

export const HighlightsTab: React.FC<HighlightsTabProps> = ({ highlights }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const getImportanceStyles = (importance: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high':
        return {
          border: 'border-l-4 border-red-500',
          badge: 'bg-red-500/10 text-red-400',
          icon: '🔴',
        };
      case 'medium':
        return {
          border: 'border-l-4 border-yellow-500',
          badge: 'bg-yellow-500/10 text-yellow-400',
          icon: '🟡',
        };
      case 'low':
        return {
          border: 'border-l-4 border-blue-500',
          badge: 'bg-blue-500/10 text-blue-400',
          icon: '🔵',
        };
    }
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!highlights || highlights.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-white/40 text-sm p-6">
        <div className="text-center space-y-2">
          <svg className="w-12 h-12 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p>No highlights available</p>
          <p className="text-xs">Key moments will appear here after recording</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">⭐</span>
          Key Highlights ({highlights.length})
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-white/60">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-white/60">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-white/60">Low</span>
          </div>
        </div>
      </div>

      {/* Highlights List */}
      <div className="space-y-4">
        {highlights.map((highlight, index) => {
          const styles = getImportanceStyles(highlight.importance);
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              onClick={() => toggleExpanded(index)}
              className={`glass rounded-squircle p-5 ${styles.border} smooth-transition cursor-pointer hover:bg-white/10 active:scale-[0.99]`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{styles.icon}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                    {highlight.importance.charAt(0).toUpperCase() + highlight.importance.slice(1)}
                  </span>
                </div>
                <button
                  className="text-white/40 hover:text-white/60 smooth-transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(index);
                  }}
                >
                  <svg
                    className={`w-5 h-5 smooth-transition ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Quote */}
              <blockquote className="relative pl-4 mb-3">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 rounded-full" />
                <p className="text-white/90 leading-relaxed italic">"{highlight.quote}"</p>
              </blockquote>

              {/* Speaker & Timestamp */}
              <div className="flex items-center gap-3 text-sm text-white/60">
                {highlight.speaker && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center text-xs font-semibold text-white">
                      {highlight.speaker.charAt(0).toUpperCase()}
                    </div>
                    <span>{highlight.speaker}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-mono text-apple-blue">{highlight.timestamp}</span>
                </div>
              </div>

              {/* Expanded Context */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="glass rounded-lg p-3">
                    <p className="text-xs text-white/50 mb-1">Context</p>
                    <p className="text-sm text-white/70 leading-relaxed">
                      This highlight was captured at {highlight.timestamp} during the meeting.
                      {highlight.speaker && ` Spoken by ${highlight.speaker}.`}
                      {highlight.importance === 'high' && ' Marked as high importance due to critical information or decision.'}
                      {highlight.importance === 'medium' && ' Marked as medium importance due to notable discussion point.'}
                      {highlight.importance === 'low' && ' Marked as relevant for future reference.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
