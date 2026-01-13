import { useState, useEffect } from 'react';
import type { MeetingSummary } from '../../types/meeting';
import { storageManager } from '../../utils/storage';
import { MeetingCard } from './MeetingCard';
import { SearchBar } from './SearchBar';
import { EmptyState } from './EmptyState';
import { FloatingActionButton } from './FloatingActionButton';
import { FrameworkSelector } from './FrameworkSelector';

interface DashboardProps {
  onStartRecording: (framework: string) => void;
  onOpenMeeting: (summary: MeetingSummary) => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartRecording,
  onOpenMeeting,
  onOpenSettings,
}) => {
  const [meetings, setMeetings] = useState<MeetingSummary[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<MeetingSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFrameworkSelector, setShowFrameworkSelector] = useState(false);

  // Load meetings from localStorage
  useEffect(() => {
    const loadedMeetings = storageManager.getAllSummaries();
    setMeetings(loadedMeetings);
    setFilteredMeetings(loadedMeetings);
  }, []);

  // Filter meetings based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMeetings(meetings);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = meetings.filter((meeting) => {
      const overview = meeting.overview.toLowerCase();
      const participants = meeting.participants.join(' ').toLowerCase();
      return overview.includes(query) || participants.includes(query);
    });
    setFilteredMeetings(filtered);
  }, [searchQuery, meetings]);

  const handleDeleteMeeting = (meetingId: string) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    const updatedMeetings = meetings.filter((m) => m.id !== meetingId);
    setMeetings(updatedMeetings);

    // Update localStorage
    const allSummaries = storageManager.getAllSummaries();
    const filtered = allSummaries.filter((s) => s.id !== meetingId);
    localStorage.setItem('listenin_summaries', JSON.stringify(filtered));
  };

  const handleFrameworkSelected = (framework: string) => {
    setShowFrameworkSelector(false);
    onStartRecording(framework);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass fixed top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">ListenIn</h1>
            <button
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 smooth-transition flex items-center justify-center"
              aria-label="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredMeetings.length === 0 && !searchQuery && (
            <EmptyState onStartRecording={() => setShowFrameworkSelector(true)} />
          )}

          {filteredMeetings.length === 0 && searchQuery && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-white/60 text-lg mb-2">No meetings found</p>
              <p className="text-white/40 text-sm">Try a different search term</p>
            </div>
          )}

          {filteredMeetings.length > 0 && (
            <div className="space-y-4">
              {filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onOpen={() => onOpenMeeting(meeting)}
                  onDelete={() => handleDeleteMeeting(meeting.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setShowFrameworkSelector(true)} />

      {/* Framework Selector Modal */}
      {showFrameworkSelector && (
        <FrameworkSelector
          onSelect={handleFrameworkSelected}
          onClose={() => setShowFrameworkSelector(false)}
        />
      )}
    </div>
  );
};
