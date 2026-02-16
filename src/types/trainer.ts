/**
 * Types for the chat training simulator.
 */

export type BranchStatus = 'active' | 'paused' | 'completed' | 'in_progress';

export interface Branch {
  id: string;
  topicId: string;
  createdAt: Date;
  status: BranchStatus;
  score?: number;
  messageIds: string[];
}

export type MessageRole = 'client' | 'specialist';

export interface Message {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export type TrainerPhase = 'welcome' | 'dialogue' | 'paused';
export type TrainerGlobalState = 'load' | 'active' | 'paused' | 'results';
