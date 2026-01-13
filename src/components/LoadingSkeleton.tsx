export const MeetingCardSkeleton: React.FC = () => {
  return (
    <div className="glass rounded-squircle p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Title skeleton */}
          <div className="h-5 bg-white/10 rounded w-3/4" />

          {/* Meta info skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-3 bg-white/10 rounded w-20" />
            <div className="h-3 bg-white/10 rounded w-16" />
          </div>

          {/* Badges skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-6 bg-white/10 rounded-full w-16" />
            <div className="h-6 bg-white/10 rounded-full w-12" />
          </div>
        </div>

        {/* Chevron skeleton */}
        <div className="w-5 h-5 bg-white/10 rounded" />
      </div>
    </div>
  );
};

export const SummaryLoadingSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Overview section */}
      <div className="glass rounded-squircle p-6 space-y-3">
        <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-5/6" />
        <div className="h-3 bg-white/10 rounded w-4/6" />
      </div>

      {/* Participants section */}
      <div className="glass rounded-squircle p-6 space-y-3">
        <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-white/10 rounded-full" />
          <div className="w-10 h-10 bg-white/10 rounded-full" />
          <div className="w-10 h-10 bg-white/10 rounded-full" />
        </div>
      </div>

      {/* Chapters section */}
      <div className="glass rounded-squircle p-6 space-y-4">
        <div className="h-4 bg-white/10 rounded w-1/4 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 bg-white/10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-white/10 rounded w-1/3" />
              <div className="h-3 bg-white/10 rounded w-full" />
              <div className="h-3 bg-white/10 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TranscriptLoadingSkeleton: React.FC = () => {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-3 bg-white/10 rounded w-11/12" />
          <div className="h-3 bg-white/10 rounded w-5/6" />
          <div className="h-2" /> {/* Spacer */}
        </div>
      ))}
    </div>
  );
};
