interface TabNavigationProps {
  activeTab: 'summary' | 'highlights' | 'actions' | 'chat';
  onTabChange: (tab: 'summary' | 'highlights' | 'actions' | 'chat') => void;
  actionItemCount?: number;
  highlightCount?: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  actionItemCount = 0,
  highlightCount = 0
}) => {
  const tabs = [
    { id: 'summary' as const, label: 'Summary', icon: '📋' },
    { id: 'highlights' as const, label: 'Highlights', icon: '⭐', count: highlightCount },
    { id: 'actions' as const, label: 'Actions', icon: '✓', count: actionItemCount },
    { id: 'chat' as const, label: 'Intel Chat', icon: '💬' },
  ];

  return (
    <div className="flex gap-1 p-2 glass rounded-squircle">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 relative px-4 py-3 rounded-xl font-medium text-sm smooth-transition ${
            activeTab === tab.id
              ? 'bg-apple-blue text-white shadow-lg shadow-apple-blue/30'
              : 'text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-apple-blue/20 text-apple-blue'
              }`}>
                {tab.count}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
