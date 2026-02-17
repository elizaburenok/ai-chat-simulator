import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTopicById, getRecommendedTopics, type UserTopicContext } from '../../data/topics';
import type { Branch, Message, TrainerPhase } from '../types/trainer';
import { deriveAnalysisResult } from '../types/results';
import { saveHistoryEntry } from '../lib/historyStorage';
import { NavigationBar } from '../../components/NavigationBar';
import { PageAction } from '../../components/PageAction';
import { UserInfoWidget } from '../../components/UserInfoWidget';
import { WelcomeContent } from './WelcomeContent';
import { DialogueContent } from './DialogueContent';
import './TrainerPage.css';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const INITIAL_CLIENT_MESSAGE: Omit<Message, 'id' | 'sessionId' | 'timestamp'> = {
  role: 'client',
  content: 'Добрый день! Подскажите, пожалуйста, как заблокировать карту — потеряла её вчера.',
};

function createInitialMessages(sessionId: string): Message[] {
  return [
    {
      ...INITIAL_CLIENT_MESSAGE,
      id: generateId(),
      sessionId,
      timestamp: new Date(),
    },
  ];
}

export function TrainerPage(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topicFromUrl = searchParams.get('topic');

  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranchId, setCurrentBranchId] = useState<string | null>(null);
  const [phase, setPhase] = useState<TrainerPhase>('welcome');
  const [messagesByBranch, setMessagesByBranch] = useState<Record<string, Message[]>>({});
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(topicFromUrl || null);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [globalState, setGlobalState] = useState<'load' | 'active' | 'paused' | 'results'>('active');
  const [analysisStep, setAnalysisStep] = useState(0);

  const currentBranch = currentBranchId ? branches.find((b) => b.id === currentBranchId) : null;
  const currentMessages = currentBranchId ? messagesByBranch[currentBranchId] ?? [] : [];
  const currentTopic = currentBranch ? getTopicById(currentBranch.topicId) : null;

  const startWithTopic = useCallback((topicId: string) => {
    const branch: Branch = {
      id: generateId(),
      topicId,
      createdAt: new Date(),
      status: 'active',
      messageIds: [],
    };
    const initialMessages = createInitialMessages(branch.id);
    branch.messageIds = initialMessages.map((m) => m.id);

    setBranches((prev) => [...prev, branch]);
    setCurrentBranchId(branch.id);
    setMessagesByBranch((prev) => ({ ...prev, [branch.id]: initialMessages }));
    setSelectedTopicId(topicId);
    setPhase('dialogue');
  }, []);

  const handleSelectTopic = useCallback(
    (topicId: string) => {
      startWithTopic(topicId);
    },
    [startWithTopic]
  );

  /** User context for topic recommendations. In real app would come from auth/profile. */
  const userContext: UserTopicContext = useMemo(
    () => ({ roleId: 'support', gradeId: 'junior' }),
    []
  );
  const recommendedTopics = useMemo(() => getRecommendedTopics(userContext), [userContext]);

  const handleSendMessage = useCallback(
    (text: string) => {
      if (!currentBranchId) return;
      const newMsg: Message = {
        id: generateId(),
        sessionId: currentBranchId,
        role: 'specialist',
        content: text,
        timestamp: new Date(),
      };
      setMessagesByBranch((prev) => ({
        ...prev,
        [currentBranchId]: [...(prev[currentBranchId] ?? []), newMsg],
      }));
      setBranches((prev) =>
        prev.map((b) =>
          b.id === currentBranchId
            ? { ...b, messageIds: [...b.messageIds, newMsg.id] }
            : b
        )
      );
      // Simulate client reply (stub: add a fixed follow-up after a short delay would be ideal; for now we don't add auto-reply)
    },
    [currentBranchId]
  );

  const runAnalysisFlow = useCallback(
    (overallScore: number) => {
      if (!currentBranchId || !currentTopic) return;
      const branchId = currentBranchId;
      const messages = [...(messagesByBranch[currentBranchId] ?? [])];
      const topic = currentTopic;

      setGlobalState('load');
      setAnalysisStep(0);

      const stepInterval = 180;
      setTimeout(() => setAnalysisStep(1), stepInterval);
      setTimeout(() => setAnalysisStep(2), stepInterval * 2);
      setTimeout(() => setAnalysisStep(3), stepInterval * 3);
      setTimeout(() => {
        const result = deriveAnalysisResult(overallScore);
        const entry = {
          id: generateId(),
          topicId: topic.id,
          topicNameRu: topic.nameRu,
          completedAt: new Date().toISOString(),
          transcription: messages,
          result,
        };
        saveHistoryEntry(entry);
        setBranches((prev) =>
          prev.map((b) =>
            b.id === branchId ? { ...b, status: 'completed' as const, score: overallScore } : b
          )
        );
        setGlobalState('results');
        navigate(`/results?id=${entry.id}`, { state: { historyEntryId: entry.id } });
      }, stepInterval * 4 + 200);
    },
    [currentBranchId, currentTopic, messagesByBranch, navigate]
  );

  const handleFinish = useCallback(() => {
    runAnalysisFlow(85);
  }, [runAnalysisFlow]);

  const handleFinishNow = useCallback(() => {
    const confirmed = window.confirm(
      'Завершить диалог сейчас? Результаты будут сохранены и вы перейдёте к анализу.'
    );
    if (!confirmed) return;
    runAnalysisFlow(70);
  }, [runAnalysisFlow]);

  const handleResume = useCallback(() => {
    setPhase('dialogue');
  }, []);

  const handlePause = useCallback(() => {
    setPhase('paused');
    if (currentBranchId) {
      setBranches((prev) =>
        prev.map((b) => (b.id === currentBranchId ? { ...b, status: 'paused' as const } : b))
      );
    }
  }, [currentBranchId]);

  const handleBackToWelcome = useCallback(() => {
    setCurrentBranchId(null);
    setPhase('welcome');
    setSelectedTopicId(null);
  }, []);

  const canFinish = currentMessages.length >= 2;

  return (
    <div className="trainer-page">
      {globalState === 'load' && (
        <div
          className="trainer-page__load-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'var(--color-overlay-popup)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          aria-live="polite"
          aria-busy="true"
        >
          <span style={{ color: 'var(--color-primitive-primary-on-inverse)', fontFamily: 'var(--font-family-primary)' }}>
            Загрузка…
          </span>
        </div>
      )}

      <main className="trainer-page__main">
        <div className="trainer-page__content">
          {(phase === 'dialogue' || phase === 'paused') && currentBranch && currentTopic && (
            <div className="trainer-page__content-left" aria-label="Навигация">
              <NavigationBar
                hasBackButton
                hasTextBlock
                title="Диалог с клиентом"
                subtitle={currentTopic.nameRu}
                onBackClick={handleBackToWelcome}
                hasItems={phase === 'dialogue'}
                items={
                  phase === 'dialogue'
                    ? [{ id: 'pause', label: 'Пауза', onClick: handlePause }]
                    : []
                }
              />
            </div>
          )}
          <div className="trainer-page__content-center">
            <div className="trainer-page__content-inner">
              {phase === 'welcome' && (
                <div className="trainer-page__welcome-nav">
                  <NavigationBar
                    hasBackButton
                    hasTextBlock
                    title="Темы"
                    onBackClick={() => navigate('/')}
                  />
                </div>
              )}
              {phase === 'welcome' && (
                <div className="trainer-page__chat-window trainer-page__chat-window--welcome">
                  <WelcomeContent
                    selectedTopicId={selectedTopicId}
                    onSelectTopic={handleSelectTopic}
                    rulesModalOpen={rulesModalOpen}
                    onOpenRules={() => setRulesModalOpen(true)}
                    onCloseRules={() => setRulesModalOpen(false)}
                    recommendedTopics={recommendedTopics}
                  />
                </div>
              )}

              {(phase === 'dialogue' || phase === 'paused') && currentBranch && currentTopic && (
                <div className="trainer-page__chat-window">
                  <div className="trainer-page__dialogue-area">
                    <DialogueContent
                      topicId={currentBranch.topicId}
                      topicNameRu={currentTopic.nameRu}
                      messages={currentMessages}
                      isPaused={phase === 'paused'}
                      canFinish={canFinish}
                      onSendMessage={handleSendMessage}
                      onFinish={handleFinish}
                      onFinishNow={handleFinishNow}
                      onResume={handleResume}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {phase !== 'welcome' && (
            <aside className="trainer-page__right" aria-label="Данные пользователя">
              <UserInfoWidget className="trainer-page__user-widget" />
              {(phase === 'dialogue' || phase === 'paused') && currentBranch && (
                <PageAction
                  title="Завершить диалог"
                  onClick={handleFinishNow}
                  className="trainer-page__finish-action"
                />
              )}
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}