export interface MeetingChapter {
  timestamp: string;
  title: string;
  summary: string;
}

export interface MeetingHighlight {
  quote: string;
  speaker: string;
  timestamp: string;
  importance: 'high' | 'medium' | 'low';
}

export interface ActionItem {
  task: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string | null;
  completed: boolean;
}

export interface MeetingSummary {
  id: string;
  overview: string;
  chapters: MeetingChapter[];
  highlights: MeetingHighlight[];
  actionItems: ActionItem[];
  participants: string[];
  duration: string;
  recordedAt: string;
  transcript: string;
}

export interface SummaryGenerationState {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  summary: MeetingSummary | null;
}
