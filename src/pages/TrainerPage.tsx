import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTopicById, getRecommendedTopics, topicsData, type UserTopicContext } from '../../data/topics';
import type { Branch, Message, TrainerPhase } from '../types/trainer';
import { deriveAnalysisResult } from '../types/results';
import { loadHistoryEntries } from '../lib/historyStorage';
import { saveHistoryEntry } from '../lib/historyStorage';
import { NavigationBar } from '../../components/NavigationBar';
import { Button } from '../../components/Button';
import { Cell } from '../../components/Cell';
import { UserInfoWidget } from '../../components/UserInfoWidget';
import { Widget } from '../../components/Widget';
import { WelcomeContent } from './WelcomeContent';
import { DialogueContent } from './DialogueContent';
import HappyFaceIcon from '../icons/HappyFace.svg';
import UnhappyFaceIcon from '../icons/UnhappyFace.svg';
import './TrainerPage.css';
const FACE_SIZE = 34;
const SCORE_THRESHOLD = 8.5;

function getTopicFaceIcon(topic: { progress: { averageScore?: number } }): string {
  const avg = topic.progress.averageScore;
  if (avg !== undefined && avg < SCORE_THRESHOLD) return UnhappyFaceIcon;
  return HappyFaceIcon;
}

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
  const [timerTick, setTimerTick] = useState(0);

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
  const userContext: UserTopicContext = useMemo(() => ({ roleId: 'support', gradeId: 'junior' }), []);
  const recommendedTopics = useMemo(() => getRecommendedTopics(userContext), [userContext]);

  const sessionsByTopic = useMemo(() => {
    const historyEntries = loadHistoryEntries();
    const byTopic = new Map<
      string,
      {
        topicId: string;
        topicNameRu: string;
        count: number;
      }
    >();

    historyEntries.forEach((entry) => {
      const existing = byTopic.get(entry.topicId);
      if (existing) {
        existing.count += 1;
      } else {
        byTopic.set(entry.topicId, {
          topicId: entry.topicId,
          topicNameRu: entry.topicNameRu,
          count: 1,
        });
      }
    });

    return Array.from(byTopic.values());
  }, []);

  const formatDialogCount = useCallback((count: number): string => {
    if (count === 1) return '1 диалог';
    return `${count} диалога`;
  }, []);

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

  /** Session timer: elapsed seconds since branch creation, formatted MM:SS */
  const sessionElapsedSeconds =
    currentBranch?.createdAt != null
      ? Math.floor((Date.now() - currentBranch.createdAt.getTime()) / 1000)
      : 0;
  const sessionTimerFormatted = useMemo(() => {
    const m = Math.floor(sessionElapsedSeconds / 60);
    const s = sessionElapsedSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, [sessionElapsedSeconds]);

  useEffect(() => {
    if (phase !== 'dialogue' && phase !== 'paused' || !currentBranchId) return;
    const id = setInterval(() => setTimerTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [phase, currentBranchId]);

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
          <span
            style={{
              color: 'var(--color-primitive-primary-on-inverse)',
              fontFamily: 'var(--font-family-primary)',
            }}
          >
            Загрузка…
          </span>
        </div>
      )}

      <main className="trainer-page__main">
        <div className="trainer-page__content">
          {(phase === 'welcome' || phase === 'dialogue' || phase === 'paused') && (
            <div className="trainer-page__content-left" aria-label="Навигация">
              {phase === 'welcome' && (
                <NavigationBar
                  hasBackButton
                  hasTextBlock
                  title="Темы"
                  onBackClick={() => navigate('/')}
                />
              )}
              {(phase === 'dialogue' || phase === 'paused') && currentBranch && currentTopic && (
                <NavigationBar
                  hasBackButton
                  hasTextBlock
                  title="Диалог с клиентом"
                  subtitle={currentTopic.nameRu}
                  onBackClick={handleBackToWelcome}
                />
              )}
            </div>
          )}
          <div className="trainer-page__content-center">
            <div className="trainer-page__content-inner">
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

          <aside className="trainer-page__right" aria-label={phase === 'welcome' ? 'Недавно открытые темы' : 'Данные пользователя'}>
            {phase === 'welcome' ? (
              <>
                {sessionsByTopic.length > 0 && (
                  <Widget
                    title="Ваши диалоги"
                    footerAction={
                      <Button type="Transparent" onClick={() => navigate('/history')}>
                        Показать все
                      </Button>
                    }
                  >
                    <div className="trainer-page__recent-topics">
                      {sessionsByTopic.map(({ topicId, topicNameRu, count }) => {
                        const topicMeta = topicsData.find((t) => t.id === topicId);
                        const faceIcon = topicMeta ? getTopicFaceIcon(topicMeta) : HappyFaceIcon;

                        return (
                          <Cell
                            key={topicId}
                            size="M"
                            variant="default"
                            icon={
                              <img
                                src={faceIcon}
                                alt=""
                                width={FACE_SIZE}
                                height={FACE_SIZE}
                                className="trainer-page__topic-avatar"
                              />
                            }
                            onClick={() => handleSelectTopic(topicId)}
                            data-testid={`recent-topic-${topicId}`}
                          >
                            {topicNameRu}, {formatDialogCount(count)}
                          </Cell>
                        );
                      })}
                    </div>
                  </Widget>
                )}
              </>
            ) : (
              <>
                {currentBranch && currentTopic && (
                  <Widget title={currentTopic.nameRu} className="trainer-page__session-widget">
                    <div className="trainer-page__session-timer" aria-live="polite">
                      {sessionTimerFormatted}
                    </div>
                    <div className="trainer-page__session-actions">
                      <Button
                        type="Secondary"
                        onClick={phase === 'paused' ? handleResume : handlePause}
                        className="trainer-page__pause-action"
                      >
                        {phase === 'paused' ? 'Продолжить диалог' : 'Пауза'}
                      </Button>
                      <Button
                        type="Primary"
                        onClick={handleFinishNow}
                        className="trainer-page__finish-action"
                      >
                        Завершить
                      </Button>
                    </div>
                  </Widget>
                )}
                <UserInfoWidget className="trainer-page__user-widget" />
              </>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}