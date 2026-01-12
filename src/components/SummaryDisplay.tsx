import type { MeetingSummary } from '../types/meeting';
import { storageManager } from '../utils/storage';
import { useState } from 'react';

interface SummaryDisplayProps {
  summary: MeetingSummary | null;
  onClose?: () => void;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, onClose }) => {
  const [actionItems, setActionItems] = useState(summary?.actionItems || []);

  if (!summary) {
    return null;
  }

  const toggleActionItem = (index: number) => {
    const updated = [...actionItems];
    updated[index].completed = !updated[index].completed;
    setActionItems(updated);
    storageManager.toggleActionItem(summary.id, index);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-white/20';
    }
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Meeting Summary</h2>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {summary.duration}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(summary.recordedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg smooth-transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Overview */}
      <section className="glass rounded-squircle p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Executive Summary
        </h3>
        <p className="text-white/80 leading-relaxed">{summary.overview}</p>
      </section>

      {/* Participants */}
      {summary.participants && summary.participants.length > 0 && (
        <section className="glass rounded-squircle p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Participants ({summary.participants.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {summary.participants.map((participant, index) => (
              <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                {participant}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Action Items */}
      {actionItems && actionItems.length > 0 && (
        <section className="glass rounded-squircle p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Action Items ({actionItems.filter(item => !item.completed).length} pending)
          </h3>
          <div className="space-y-3">
            {actionItems.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${item.completed ? 'bg-white/5 opacity-60' : 'bg-white/5'} border-white/10 smooth-transition hover:bg-white/10`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleActionItem(index)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center smooth-transition ${
                      item.completed
                        ? 'bg-apple-blue border-apple-blue'
                        : 'border-white/40 hover:border-apple-blue'
                    }`}
                  >
                    {item.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`mb-2 ${item.completed ? 'line-through text-white/60' : 'text-white/90'}`}>
                      {item.task}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded border ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className="text-white/60">
                        Assignee: {item.assignee}
                      </span>
                      {item.dueDate && (
                        <span className="text-white/60">
                          Due: {item.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Highlights */}
      {summary.highlights && summary.highlights.length > 0 && (
        <section className="glass rounded-squircle p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Key Highlights
          </h3>
          <div className="space-y-3">
            {summary.highlights.map((highlight, index) => (
              <div
                key={index}
                className={`p-4 border-l-4 ${getImportanceColor(highlight.importance)} bg-white/5 rounded-r-lg`}
              >
                <p className="text-white/90 italic mb-2">&ldquo;{highlight.quote}&rdquo;</p>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <span>{highlight.speaker}</span>
                  <span>•</span>
                  <span>{highlight.timestamp}</span>
                  <span>•</span>
                  <span className={getPriorityColor(highlight.importance).split(' ')[0]}>
                    {highlight.importance} importance
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Chapters */}
      {summary.chapters && summary.chapters.length > 0 && (
        <section className="glass rounded-squircle p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Chapters
          </h3>
          <div className="space-y-4">
            {summary.chapters.map((chapter, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-16 text-apple-blue font-mono text-sm">
                  {chapter.timestamp}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{chapter.title}</h4>
                  <p className="text-sm text-white/70">{chapter.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
