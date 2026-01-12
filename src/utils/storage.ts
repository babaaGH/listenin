import type { MeetingSummary } from '../types/meeting';

const STORAGE_KEY = 'listenin_summaries';

export const storageManager = {
  // Save a new summary
  saveSummary(summary: MeetingSummary): void {
    try {
      const summaries = this.getAllSummaries();
      summaries.unshift(summary); // Add to beginning (most recent first)

      // Keep only last 50 summaries
      const trimmed = summaries.slice(0, 50);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Failed to save summary:', error);
    }
  },

  // Get all summaries
  getAllSummaries(): MeetingSummary[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load summaries:', error);
      return [];
    }
  },

  // Get summary by ID
  getSummaryById(id: string): MeetingSummary | null {
    const summaries = this.getAllSummaries();
    return summaries.find(s => s.id === id) || null;
  },

  // Delete a summary
  deleteSummary(id: string): void {
    try {
      const summaries = this.getAllSummaries();
      const filtered = summaries.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete summary:', error);
    }
  },

  // Clear all summaries
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear summaries:', error);
    }
  },

  // Update action item completion
  toggleActionItem(summaryId: string, taskIndex: number): void {
    try {
      const summaries = this.getAllSummaries();
      const summary = summaries.find(s => s.id === summaryId);

      if (summary && summary.actionItems[taskIndex]) {
        summary.actionItems[taskIndex].completed = !summary.actionItems[taskIndex].completed;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(summaries));
      }
    } catch (error) {
      console.error('Failed to update action item:', error);
    }
  }
};
