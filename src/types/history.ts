import type { AnalysisResult } from './results';
import type { Message } from './trainer';

export interface HistoryEntry {
  id: string;
  topicId: string;
  topicNameRu: string;
  completedAt: string;
  transcription: Message[];
  result: AnalysisResult;
}
