import { useEffect, useRef } from 'react';
import type { TranscriptChunk } from '../hooks/useGeminiStreaming';

interface TranscriptDisplayProps {
  chunks: TranscriptChunk[];
  isStreaming: boolean;
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  chunks,
  isStreaming
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  // Auto-scroll to bottom when new chunks arrive
  useEffect(() => {
    if (scrollRef.current && shouldAutoScrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chunks]);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    shouldAutoScrollRef.current = isAtBottom;
  };

  const formatTimestamp = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Group chunks with timestamp markers every 30 seconds
  const groupedContent: Array<{ type: 'timestamp' | 'text'; content: string; timestamp?: number }> = [];
  let lastTimestampMarker = -30000; // Start with -30s so first marker appears at 0s

  chunks.forEach((chunk) => {
    // Add timestamp marker every 30 seconds
    if (chunk.timestamp - lastTimestampMarker >= 30000) {
      groupedContent.push({
        type: 'timestamp',
        content: formatTimestamp(chunk.timestamp),
        timestamp: chunk.timestamp
      });
      lastTimestampMarker = chunk.timestamp;
    }

    // Add text chunk
    groupedContent.push({
      type: 'text',
      content: chunk.text,
      timestamp: chunk.timestamp
    });
  });

  if (chunks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/40 text-sm">
        <div className="text-center space-y-2">
          <svg className="w-12 h-12 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Transcript will appear here...</p>
          <p className="text-xs">Start recording to see real-time transcription</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Transcript scroll container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {groupedContent.map((item, index) => {
          if (item.type === 'timestamp') {
            return (
              <div key={`timestamp-${index}`} className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <div className="text-xs text-white/40 font-mono px-2 py-1 glass rounded-full">
                  {item.content}
                </div>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            );
          }

          return (
            <div
              key={`text-${index}`}
              className="text-white/90 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {item.content}
            </div>
          );
        })}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex items-center gap-2 text-apple-blue text-sm animate-pulse">
            <div className="w-2 h-2 rounded-full bg-apple-blue animate-ping" />
            <span>Listening...</span>
          </div>
        )}
      </div>

      {/* Fade mask at bottom - OLED aesthetic */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)'
        }}
      />
    </div>
  );
};
