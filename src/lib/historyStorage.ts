import type { HistoryEntry } from '../types/history';
import type { Message } from '../types/trainer';

const STORAGE_KEY = 'ai-trainer-history';

interface StoredMessage {
  id: string;
  sessionId: string;
  role: Message['role'];
  content: string;
  timestamp: string;
}

interface StoredHistoryEntry {
  id: string;
  topicId: string;
  topicNameRu: string;
  completedAt: string;
  transcription: StoredMessage[];
  result: HistoryEntry['result'];
}

function toStoredMessage(m: Message): StoredMessage {
  return {
    ...m,
    timestamp: m.timestamp instanceof Date ? m.timestamp.toISOString() : String(m.timestamp),
  };
}

function fromStoredMessage(m: StoredMessage): Message {
  return {
    ...m,
    timestamp: new Date(m.timestamp),
  };
}

function toStored(entry: HistoryEntry): StoredHistoryEntry {
  return {
    ...entry,
    transcription: entry.transcription.map(toStoredMessage),
  };
}

function fromStored(s: StoredHistoryEntry): HistoryEntry {
  return {
    ...s,
    transcription: s.transcription.map(fromStoredMessage),
  };
}

export function saveHistoryEntry(entry: HistoryEntry): void {
  const stored = loadStored();
  stored.push(toStored(entry));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // QuotaExceeded or other
  }
}

function loadStored(): StoredHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadHistoryEntries(): HistoryEntry[] {
  const stored = loadStored();
  return stored.map(fromStored).sort((a, b) => (b.completedAt > a.completedAt ? 1 : -1));
}

export function getHistoryEntryById(id: string): HistoryEntry | null {
  const stored = loadStored();
  const found = stored.find((e) => e.id === id);
  return found ? fromStored(found) : null;
}
