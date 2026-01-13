import { useState } from 'react';
import type { MeetingSummary } from '../../types/meeting';

interface MeetingCardProps {
  meeting: MeetingSummary;
  onOpen: () => void;
  onDelete: () => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, onOpen, onDelete }) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  const title = meeting.overview.length > 50
    ? meeting.overview.substring(0, 50) + '...'
    : meeting.overview;

  const getFrameworkInfo = (framework: string) => {
    const frameworks: Record<string, { icon: string; label: string; color: string }> = {
      sales: { icon: '💼', label: 'Sales Call', color: 'bg-green-500/20 text-green-400' },
      'one-on-one': { icon: '🤝', label: '1:1', color: 'bg-purple-500/20 text-purple-400' },
      standup: { icon: '⚡', label: 'Standup', color: 'bg-orange-500/20 text-orange-400' },
      brainstorm: { icon: '💡', label: 'Brainstorm', color: 'bg-pink-500/20 text-pink-400' },
      general: { icon: '📝', label: 'General', color: 'bg-blue-500/20 text-blue-400' },
    };
    return frameworks[framework] || frameworks.general;
  };

  const frameworkInfo = getFrameworkInfo(meeting.framework || 'general');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = touchStartX - currentX;

    if (diff > 50) {
      setIsSwiped(true);
    } else if (diff < -20) {
      setIsSwiped(false);
    }
  };

  const handleDelete = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    onDelete();
  };

  return (
    <div className="relative overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
      {/* Delete Button (appears on swipe) */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-24 bg-red-500 flex items-center justify-center rounded-squircle smooth-transition ${
          isSwiped ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button onClick={handleDelete} className="text-white font-medium text-sm">
          Delete
        </button>
      </div>

      {/* Card Content */}
      <div
        onClick={onOpen}
        className={`glass rounded-squircle p-5 cursor-pointer hover:bg-white/10 smooth-transition active:scale-[0.98] ${
          isSwiped ? '-translate-x-24' : 'translate-x-0'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Title with Framework Badge */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-semibold truncate flex-1">{title}</h3>
              <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${frameworkInfo.color}`}>
                <span>{frameworkInfo.icon}</span>
                <span className="hidden sm:inline">{frameworkInfo.label}</span>
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-xs text-white/60 mb-3">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(meeting.recordedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{meeting.duration}</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Participants */}
              {meeting.participants && meeting.participants.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-full text-xs text-white/60">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{meeting.participants.length}</span>
                </div>
              )}

              {/* Action Items */}
              {meeting.actionItems && meeting.actionItems.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-apple-blue/20 rounded-full text-xs text-apple-blue font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>{meeting.actionItems.length}</span>
                </div>
              )}

              {/* Highlights */}
              {meeting.highlights && meeting.highlights.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full text-xs text-yellow-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{meeting.highlights.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Chevron */}
          <div className="flex-shrink-0 text-white/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
