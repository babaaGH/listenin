import { useState, useCallback } from 'react';
import type { MeetingSummary } from '../../types/meeting';
import { TabNavigation } from './TabNavigation';
import { SummaryTab } from './SummaryTab';
import { HighlightsTab } from './HighlightsTab';
import { ActionItemsTab } from './ActionItemsTab';
import { IntelChatTab } from './IntelChatTab';
import { storageManager } from '../../utils/storage';

interface MeetingDetailProps {
  summary: MeetingSummary;
  onClose?: () => void;
  onSummaryUpdate?: (summary: MeetingSummary) => void;
}

export const MeetingDetail: React.FC<MeetingDetailProps> = ({
  summary: initialSummary,
  onClose,
  onSummaryUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'highlights' | 'actions' | 'chat'>('summary');
  const [summary, setSummary] = useState(initialSummary);

  const getFrameworkInfo = (framework: string) => {
    const frameworks: Record<string, { icon: string; label: string; color: string }> = {
      sales: { icon: '💼', label: 'Sales Call', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      'one-on-one': { icon: '🤝', label: '1:1 Meeting', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      standup: { icon: '⚡', label: 'Standup', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
      brainstorm: { icon: '💡', label: 'Brainstorm', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
      general: { icon: '📝', label: 'General', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    };
    return frameworks[framework] || frameworks.general;
  };

  const frameworkInfo = getFrameworkInfo(summary.framework || 'general');

  const handleToggleActionItem = useCallback(
    (index: number) => {
      // Update local state
      const updatedSummary = {
        ...summary,
        actionItems: summary.actionItems.map((item, idx) =>
          idx === index ? { ...item, completed: !item.completed } : item
        ),
      };
      setSummary(updatedSummary);

      // Persist to localStorage
      storageManager.toggleActionItem(summary.id, index);

      // Notify parent component
      onSummaryUpdate?.(updatedSummary);
    },
    [summary, onSummaryUpdate]
  );

  const handleDeleteActionItem = useCallback(
    (index: number) => {
      // Update local state
      const updatedSummary = {
        ...summary,
        actionItems: summary.actionItems.filter((_, idx) => idx !== index),
      };
      setSummary(updatedSummary);

      // Persist to localStorage
      const allSummaries = storageManager.getAllSummaries();
      const summaryIndex = allSummaries.findIndex((s) => s.id === summary.id);
      if (summaryIndex !== -1) {
        allSummaries[summaryIndex] = updatedSummary;
        localStorage.setItem('listenin_summaries', JSON.stringify(allSummaries));
      }

      // Notify parent component
      onSummaryUpdate?.(updatedSummary);
    },
    [summary, onSummaryUpdate]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 smooth-transition flex items-center justify-center"
                  aria-label="Go back"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-semibold">Meeting Detail</h1>
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${frameworkInfo.color}`}>
                    <span>{frameworkInfo.icon}</span>
                    <span>{frameworkInfo.label}</span>
                  </span>
                </div>
                <p className="text-sm text-white/60">
                  {new Date(summary.recordedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {summary.duration}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tab Navigation */}
          <div className="mb-6">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              actionItemCount={summary.actionItems?.length || 0}
              highlightCount={summary.highlights?.length || 0}
            />
          </div>

          {/* Tab Content */}
          <div className="glass rounded-squircle min-h-[600px]">
            {activeTab === 'summary' && <SummaryTab summary={summary} />}

            {activeTab === 'highlights' && (
              <HighlightsTab highlights={summary.highlights || []} />
            )}

            {activeTab === 'actions' && (
              <ActionItemsTab
                actionItems={summary.actionItems || []}
                summaryId={summary.id}
                onToggleComplete={handleToggleActionItem}
                onDelete={handleDeleteActionItem}
              />
            )}

            {activeTab === 'chat' && (
              <IntelChatTab transcript={summary.transcript} summaryId={summary.id} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-white/30">
        <p>Powered by Gemini 2.0 Flash</p>
      </footer>
    </div>
  );
};
