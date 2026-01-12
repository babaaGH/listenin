import { useState } from 'react';
import type { ActionItem } from '../../types/meeting';

interface ActionItemsTabProps {
  actionItems: ActionItem[];
  summaryId: string;
  onToggleComplete: (index: number) => void;
  onDelete: (index: number) => void;
}

export const ActionItemsTab: React.FC<ActionItemsTabProps> = ({
  actionItems,
  onToggleComplete,
  onDelete,
}) => {
  const [swipedIndex, setSwipedIndex] = useState<number | null>(null);

  const getPriorityStyles = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          badge: 'bg-red-500/10 text-red-400 border-red-500/30',
          icon: '🔴',
        };
      case 'medium':
        return {
          badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
          icon: '🟡',
        };
      case 'low':
        return {
          badge: 'bg-green-500/10 text-green-400 border-green-500/30',
          icon: '🟢',
        };
    }
  };

  // Group action items by priority
  const groupedItems = {
    high: actionItems.filter((item) => item.priority === 'high'),
    medium: actionItems.filter((item) => item.priority === 'medium'),
    low: actionItems.filter((item) => item.priority === 'low'),
  };

  const handleSwipe = (index: number) => {
    setSwipedIndex(swipedIndex === index ? null : index);
  };

  const handleDelete = (index: number) => {
    onDelete(index);
    setSwipedIndex(null);
  };

  const renderActionItem = (item: ActionItem, index: number) => {
    const styles = getPriorityStyles(item.priority);
    const isSwiped = swipedIndex === index;

    return (
      <div
        key={index}
        className="relative overflow-hidden"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          const startX = touch.clientX;
          const element = e.currentTarget;

          const handleTouchMove = (moveEvent: TouchEvent) => {
            const currentTouch = moveEvent.touches[0];
            const diff = startX - currentTouch.clientX;
            if (diff > 50) {
              handleSwipe(index);
            }
          };

          const handleTouchEnd = () => {
            element.removeEventListener('touchmove', handleTouchMove as any);
            element.removeEventListener('touchend', handleTouchEnd);
          };

          element.addEventListener('touchmove', handleTouchMove as any);
          element.addEventListener('touchend', handleTouchEnd);
        }}
      >
        {/* Delete Button (appears on swipe) */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center smooth-transition ${
            isSwiped ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={() => handleDelete(index)}
            className="text-white font-medium"
          >
            Delete
          </button>
        </div>

        {/* Action Item Card */}
        <div
          className={`glass rounded-xl p-4 smooth-transition ${
            isSwiped ? '-translate-x-20' : 'translate-x-0'
          } ${item.completed ? 'opacity-60' : ''}`}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => onToggleComplete(index)}
              className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 smooth-transition flex items-center justify-center ${
                item.completed
                  ? 'bg-apple-blue border-apple-blue'
                  : 'border-white/30 hover:border-apple-blue'
              }`}
            >
              {item.completed && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Task */}
              <p className={`text-white/90 mb-2 leading-relaxed ${item.completed ? 'line-through text-white/50' : ''}`}>
                {item.task}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-3 flex-wrap text-xs">
                {/* Priority Badge */}
                <span className={`px-2 py-1 rounded-full border ${styles.badge} font-medium flex items-center gap-1`}>
                  <span>{styles.icon}</span>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>

                {/* Assignee */}
                {item.assignee && (
                  <div className="flex items-center gap-1.5 text-white/60">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center text-[10px] font-semibold text-white">
                      {item.assignee.charAt(0).toUpperCase()}
                    </div>
                    <span>{item.assignee}</span>
                  </div>
                )}

                {/* Due Date */}
                {item.dueDate && (
                  <div className="flex items-center gap-1 text-white/60">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{item.dueDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Swipe Indicator */}
            <button
              onClick={() => handleSwipe(index)}
              className="flex-shrink-0 text-white/40 hover:text-white/60 smooth-transition md:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Desktop Delete Button */}
            <button
              onClick={() => handleDelete(index)}
              className="hidden md:flex flex-shrink-0 text-red-400 hover:text-red-300 smooth-transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPrioritySection = (priority: 'high' | 'medium' | 'low', items: ActionItem[]) => {
    if (items.length === 0) return null;

    const styles = getPriorityStyles(priority);
    const completedCount = items.filter((item) => item.completed).length;

    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <span>{styles.icon}</span>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </h3>
          <span className="text-xs text-white/40">
            {completedCount}/{items.length} completed
          </span>
        </div>
        <div className="space-y-2">
          {items.map((item) =>
            renderActionItem(item, actionItems.indexOf(item))
          )}
        </div>
      </section>
    );
  };

  if (!actionItems || actionItems.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-white/40 text-sm p-6">
        <div className="text-center space-y-2">
          <svg className="w-12 h-12 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p>No action items available</p>
          <p className="text-xs">Tasks and assignments will appear here after recording</p>
        </div>
      </div>
    );
  }

  const totalCompleted = actionItems.filter((item) => item.completed).length;
  const completionPercentage = Math.round((totalCompleted / actionItems.length) * 100);

  return (
    <div className="space-y-6 p-6">
      {/* Header with Progress */}
      <div className="glass rounded-squircle p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-xl">✓</span>
            Action Items ({actionItems.length})
          </h3>
          <span className="text-sm text-white/60">
            {totalCompleted}/{actionItems.length} done
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-apple-blue to-blue-600 smooth-transition"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Swipe Hint (mobile only) */}
      <div className="md:hidden text-xs text-white/40 text-center flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        Swipe left to delete
      </div>

      {/* Grouped Action Items */}
      <div className="space-y-6">
        {renderPrioritySection('high', groupedItems.high)}
        {renderPrioritySection('medium', groupedItems.medium)}
        {renderPrioritySection('low', groupedItems.low)}
      </div>
    </div>
  );
};
