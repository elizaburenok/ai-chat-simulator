import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTopicById, getRecommendedTopics, type UserTopicContext } from '../../data/topics';
import type { Branch, Message, TrainerPhase } from '../types/trainer';
import { deriveBlockScores, type BlockScores } from '../types/results';
import { NavigationBar } from '../../components/NavigationBar';
import { UserInfoWidget } from '../../components/UserInfoWidget';
import { WelcomeContent } from './WelcomeContent';
import { DialogueContent } from './DialogueContent';
import './TrainerPage.css';

function BackIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M3 6h18v2l-1 14H4L3 8V6zm5 0V4a2 2 0 012-2h4a2 2 0 012 2v2M9 11v6M15 11v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

function getBranchStatusLabel(status: Branch['status']): string {
  switch (status) {
    case 'active':
      return 'Активная';
    case 'paused':
      return 'В процессе';
    case 'completed':
      return 'Завершена';
    default:
      return 'Активная';
  }
}

function formatBranchDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
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
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [globalState, setGlobalState] = useState<'load' | 'active' | 'paused' | 'results'>('active');

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

  const handleFinish = useCallback(() => {
    setGlobalState('load');
    const overallScore = 85;
    const blockScores: BlockScores = deriveBlockScores(overallScore);
    if (currentBranchId) {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === currentBranchId ? { ...b, status: 'completed' as const, score: overallScore } : b
        )
      );
    }
    setTimeout(() => {
      setGlobalState('results');
      navigate('/results', { state: { blockScores } });
    }, 400);
  }, [currentBranchId, navigate]);

  const handleFinishNow = useCallback(() => {
    const confirmed = window.confirm(
      'Завершить диалог сейчас? Результаты будут сохранены и вы перейдёте к анализу.'
    );
    if (!confirmed) return;
    setGlobalState('load');
    const overallScore = 70;
    const blockScores: BlockScores = deriveBlockScores(overallScore);
    if (currentBranchId) {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === currentBranchId ? { ...b, status: 'completed' as const, score: overallScore } : b
        )
      );
    }
    setTimeout(() => {
      setGlobalState('results');
      navigate('/results', { state: { blockScores } });
    }, 400);
  }, [currentBranchId, navigate]);

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

  const handleBranchSelect = useCallback((branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    if (!branch) return;
    setCurrentBranchId(branchId);
    if (branch.status === 'completed') {
      navigate('/results');
      return;
    }
    if (branch.status === 'active' || branch.status === 'paused') {
      setPhase(branch.status === 'paused' ? 'paused' : 'dialogue');
    }
  }, [branches, navigate]);

  const handleDeleteBranch = useCallback(
    (e: React.MouseEvent, branchId: string) => {
      e.stopPropagation();
      const branch = branches.find((b) => b.id === branchId);
      if (!branch) return;
      const topic = getTopicById(branch.topicId);
      const label = topic?.nameRu ?? branch.topicId;
      const confirmed = window.confirm(`Удалить сессию «${label}»? Это действие нельзя отменить.`);
      if (!confirmed) return;

      const isCurrentBranch = currentBranchId === branchId;
      
      // Calculate remaining branches BEFORE state update to avoid stale closure
      const remaining = branches.filter((b) => b.id !== branchId);

      setBranches((prev) => prev.filter((b) => b.id !== branchId));
      setMessagesByBranch((prev) => {
        const next = { ...prev };
        delete next[branchId];
        return next;
      });

      if (isCurrentBranch) {
        if (remaining.length === 0) {
          setCurrentBranchId(null);
          setPhase('welcome');
          setSelectedTopicId(null);
        } else {
          const nextActiveOrPaused = remaining.find((b) => b.status === 'active' || b.status === 'paused');
          const nextBranch = nextActiveOrPaused ?? remaining[0];
          setCurrentBranchId(nextBranch.id);
          if (nextBranch.status === 'completed') {
            const blockScores = deriveBlockScores(nextBranch.score ?? 70);
            navigate('/results', { state: { blockScores } });
          } else {
            setPhase(nextBranch.status === 'paused' ? 'paused' : 'dialogue');
          }
        }
      }
    },
    [branches, currentBranchId, navigate]
  );

  const handleBackToWelcome = useCallback(() => {
    setCurrentBranchId(null);
    setPhase('welcome');
    setSelectedTopicId(null);
  }, []);

  const canFinish = currentMessages.length >= 2;

  return (
    <div className={`trainer-page ${navCollapsed ? 'trainer-page__nav-collapsed' : ''}`}>
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
      <aside className="trainer-page__nav">
        {phase === 'welcome' ? (
          <NavigationBar
            hasBackButton
            hasTextBlock
            title="Темы"
            onBackClick={() => navigate('/')}
          />
        ) : (
          <>
            <h2 className="trainer-page__nav-title">Сессии</h2>
            {branches.map((branch) => {
              const topic = getTopicById(branch.topicId);
              const label = topic?.nameRu ?? branch.topicId;
              const isActive = branch.id === currentBranchId;
              return (
                <div
                  key={branch.id}
                  className={`branch-item-wrap ${isActive ? 'branch-item-wrap--active' : ''}`}
                >
                  <button
                    type="button"
                    className="branch-item"
                    onClick={() => handleBranchSelect(branch.id)}
                  >
                    <span className="branch-item__label">{label}</span>
                    <span className="branch-item__meta">{formatBranchDate(branch.createdAt)}</span>
                    <span className="branch-item__status">{getBranchStatusLabel(branch.status)}</span>
                    {branch.score != null && (
                      <span className="branch-item__meta">Оценка: {branch.score}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="branch-item__delete"
                    onClick={(e) => handleDeleteBranch(e, branch.id)}
                    aria-label={`Удалить сессию «${label}»`}
                    title="Удалить сессию"
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              className="trainer-page__nav-toggle"
              onClick={() => setNavCollapsed((c) => !c)}
              aria-label={navCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </aside>

      <main className="trainer-page__main">
        <div className="trainer-page__content">
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
                <header className="trainer-page__chat-header">
                  <button
                    type="button"
                    className="trainer-page__chat-back"
                    onClick={handleBackToWelcome}
                    aria-label="К выбору темы"
                  >
                    <BackIcon />
                  </button>
                  <h1 className="trainer-page__chat-title">AI-Ассистент</h1>
                  {phase === 'dialogue' && (
                    <button
                      type="button"
                      className="trainer-page__chat-pause"
                      onClick={handlePause}
                    >
                      Пауза
                    </button>
                  )}
                </header>
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

          {phase !== 'welcome' && (
            <aside className="trainer-page__right" aria-label="Данные пользователя">
              <UserInfoWidget className="trainer-page__user-widget" />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}