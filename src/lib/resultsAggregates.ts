import type { HistoryEntry } from '../types/history';

export interface TopicProgressStats {
  topicAttempts: number;
  firstAttemptScore: number;
  latestAttemptScore: number;
  improvementDelta: number;
}

export function getEntryAverageScore(entry: HistoryEntry): number {
  const { block1, block2, block3 } = entry.result;
  return Math.round((block1.score + block2.score + block3.score) / 3);
}

export function getTopicProgressFromHistory(
  entries: HistoryEntry[],
  topicId: string
): TopicProgressStats | null {
  const topicEntries = entries.filter((entry) => entry.topicId === topicId);

  if (topicEntries.length === 0) {
    return null;
  }

  const sorted = [...topicEntries].sort((a, b) => {
    const aTime = new Date(a.completedAt).getTime();
    const bTime = new Date(b.completedAt).getTime();
    return aTime - bTime;
  });

  const first = sorted[0];
  const latest = sorted[sorted.length - 1];

  const firstAttemptScore = getEntryAverageScore(first);
  const latestAttemptScore = getEntryAverageScore(latest);

  return {
    topicAttempts: topicEntries.length,
    firstAttemptScore,
    latestAttemptScore,
    improvementDelta: latestAttemptScore - firstAttemptScore,
  };
}

export function getTotalSessionsCompleted(entries: HistoryEntry[]): number {
  return entries.length;
}

