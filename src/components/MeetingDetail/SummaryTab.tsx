import type { MeetingSummary } from '../../types/meeting';

interface SummaryTabProps {
  summary: MeetingSummary;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ summary }) => {
  return (
    <div className="space-y-6 p-6">
      {/* Overview Card */}
      <section className="glass rounded-squircle p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">📋</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Executive Overview</h3>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {summary.duration}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(summary.recordedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <p className="text-white/90 leading-relaxed">{summary.overview}</p>
      </section>

      {/* Participants */}
      {summary.participants && summary.participants.length > 0 && (
        <section className="glass rounded-squircle p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-xl">👥</span>
            Participants ({summary.participants.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {summary.participants.map((participant, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full smooth-transition hover:bg-white/15"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center text-sm font-semibold">
                  {participant.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm">{participant}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Chapters Timeline */}
      {summary.chapters && summary.chapters.length > 0 && (
        <section className="glass rounded-squircle p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="text-xl">📖</span>
            Chapters
          </h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-apple-blue via-blue-600 to-transparent" />

            {/* Chapter Items */}
            <div className="space-y-6">
              {summary.chapters.map((chapter, index) => (
                <div key={index} className="relative flex gap-4">
                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 w-16 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-apple-blue flex items-center justify-center text-xs font-mono font-semibold shadow-lg shadow-apple-blue/30 z-10">
                      {index + 1}
                    </div>
                    <div className="text-xs text-apple-blue font-mono mt-1">
                      {chapter.timestamp}
                    </div>
                  </div>

                  {/* Chapter Content */}
                  <div className="flex-1 pb-2">
                    <div className="glass rounded-xl p-4 hover:bg-white/10 smooth-transition">
                      <h4 className="font-semibold mb-2 text-white">{chapter.title}</h4>
                      <p className="text-sm text-white/70 leading-relaxed">{chapter.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
