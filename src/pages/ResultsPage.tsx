import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { TopicProgressWidget } from '../../components/TopicProgressWidget';
import { loadHistoryEntries, getHistoryEntryById } from '../lib/historyStorage';
import {
  getTopicProgressFromHistory,
  getTotalSessionsCompleted,
  type TopicProgressStats,
} from '../lib/resultsAggregates';
import { deriveAnalysisResult, type AnalysisResult, type BlockPoint } from '../types/results';
import type { BlockScores } from '../types/results';
import type { Message } from '../types/trainer';
import './ResultsPage.css';

const BLOCK1_LABEL = 'База знаний';
const BLOCK2_LABEL = 'Общий тон ответов и соответствие tone of voice';
const BLOCK3_LABEL = 'Соблюдение орфографических норм';

function SegmentedProgressBar({ score }: { score: BlockPoint }): React.ReactElement {
  return (
    <div className="results-page__segmented-bar" role="progressbar" aria-valuenow={score} aria-valuemin={1} aria-valuemax={5}>
      {([1, 2, 3, 4, 5] as const).map((point) => (
        <div
          key={point}
          className={`results-page__segment ${point <= score ? 'results-page__segment--filled' : ''}`}
        />
      ))}
    </div>
  );
}

interface ResolvedResult {
  result: AnalysisResult;
  topicId?: string;
  topicNameRu?: string;
  transcription?: Message[];
}

function resolveResult(locationState: unknown, idFromUrl: string | null): ResolvedResult | null {
  const state = locationState as {
    historyEntryId?: string;
    result?: AnalysisResult;
    blockScores?: BlockScores;
  } | null;
  const historyId = state?.historyEntryId ?? idFromUrl;
  if (historyId) {
    const entry = getHistoryEntryById(historyId);
    if (entry) {
      return {
        result: entry.result,
        topicId: entry.topicId,
        topicNameRu: entry.topicNameRu,
        transcription: entry.transcription,
      };
    }
  }
  if (state?.result) return { result: state.result };
  if (state?.blockScores) {
    const avg = Math.round((state.blockScores.block1 + state.blockScores.block2 + state.blockScores.block3) / 3);
    return { result: deriveAnalysisResult(avg) };
  }
  return null;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(
    date instanceof Date ? date : new Date(date)
  );
}

export function ResultsPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get('id');

  const [analysisError, setAnalysisError] = useState(false);
  const resolved = useMemo(
    () => resolveResult(location.state, idFromUrl),
    [location.state, idFromUrl]
  );

  const historyEntries = useMemo(() => loadHistoryEntries(), []);
  const totalSessionsCompleted = useMemo(
    () => getTotalSessionsCompleted(historyEntries),
    [historyEntries]
  );

  const topicStats: TopicProgressStats | null = useMemo(() => {
    if (!resolved?.topicId) {
      return null;
    }
    return getTopicProgressFromHistory(historyEntries, resolved.topicId);
  }, [historyEntries, resolved?.topicId]);

  const handleClose = () => {
    navigate('/');
  };

  const handleNewSession = () => {
    navigate('/trainer');
  };

  const handleRetry = () => {
    setAnalysisError(false);
  };

  if (analysisError) {
    return (
      <div className="results-page">
        <div className="results-page__left" aria-hidden="true" />
        <div className="results-page__content">
          <div className="results-page__main">
            <div className="results-page__scroll">
              <h1 className="results-page__title">Результаты</h1>
              <div className="results-page__error">Попробуйте позже</div>
            </div>
            <footer className="results-page__footer" aria-label="Действия страницы">
              <div className="results-page__footer-actions">
                <Button type="Primary" onClick={handleRetry}>
                  Повторить
                </Button>
              </div>
            </footer>
          </div>
          <aside className="results-page__right" aria-label="Прогресс по темам">
            <TopicProgressWidget
              topicName={resolved?.topicNameRu}
              topicStats={topicStats}
              totalSessionsCompleted={totalSessionsCompleted}
              className="results-page__user-widget"
            />
          </aside>
        </div>
      </div>
    );
  }

  if (!resolved) {
    return (
      <div className="results-page">
        <div className="results-page__left" aria-hidden="true" />
        <div className="results-page__content">
          <div className="results-page__main">
            <div className="results-page__scroll">
              <h1 className="results-page__title">Результаты</h1>
              <p className="results-page__empty">Нет данных для отображения. Завершите сессию тренажёра или выберите результат из истории.</p>
            </div>
            <footer className="results-page__footer" aria-label="Действия страницы">
              <div className="results-page__footer-actions">
                <Button type="Primary" onClick={() => navigate('/trainer')}>
                  К тренажёру
                </Button>
              </div>
            </footer>
          </div>
          <aside className="results-page__right" aria-label="Прогресс по темам">
            <TopicProgressWidget
              topicName={undefined}
              topicStats={topicStats}
              totalSessionsCompleted={totalSessionsCompleted}
              className="results-page__user-widget"
            />
          </aside>
        </div>
      </div>
    );
  }

  const { result, topicNameRu, transcription } = resolved;
  const firstClientMessage = transcription?.find((msg) => msg.role === 'client');

  return (
    <div className="results-page">
      <div className="results-page__left" aria-hidden="true" />
      <div className="results-page__content">
        <div className="results-page__main">
          <div className="results-page__scroll">
            <h1 className="results-page__title">Результаты</h1>
            {topicNameRu && (
              <p className="results-page__topic" aria-label="Тема">
                Тема: {topicNameRu}
              </p>
            )}

            <p className="results-page__summary">{result.summary}</p>

            <section className="results-page__criteria">
              <div className="results-page__block" aria-labelledby="block1-title">
                <h2 id="block1-title" className="results-page__block-title">
                  {BLOCK1_LABEL}
                </h2>
                <SegmentedProgressBar score={result.block1.score} />
                <p className="results-page__block-description">{result.block1.description}</p>
              </div>

              <div className="results-page__block" aria-labelledby="block2-title">
                <h2 id="block2-title" className="results-page__block-title">
                  {BLOCK2_LABEL}
                </h2>
                <SegmentedProgressBar score={result.block2.score} />
                <p className="results-page__block-description">{result.block2.description}</p>
              </div>

              <div className="results-page__block" aria-labelledby="block3-title">
                <h2 id="block3-title" className="results-page__block-title">
                  {BLOCK3_LABEL}
                </h2>
                <SegmentedProgressBar score={result.block3.score} />
                <p className="results-page__block-description">{result.block3.description}</p>
              </div>
            </section>

            {firstClientMessage && (
              <section className="results-page__dialog-info" aria-label="Данные клиента и первичный запрос">
                <p>Имя: Ольга Семёнова</p>
                <p>Тип доступности: Обычный</p>
                <p>Бизнес: ИП</p>
                <p>Система налогообложения: УСН</p>
                <p>Первичный запрос клиента: {firstClientMessage.content}</p>
              </section>
            )}

            {/* Диалог больше не отображается на этой странице по требованиям */}
          </div>

          <footer className="results-page__footer" aria-label="Действия страницы">
            <div className="results-page__footer-actions">
              <Button type="Primary" onClick={handleClose} data-testid="results-close">
                Закрыть
              </Button>
              <Button type="Secondary" onClick={handleNewSession} data-testid="results-new-session">
                Новая сессия
              </Button>
            </div>
          </footer>
        </div>

        <aside className="results-page__right" aria-label="Прогресс по темам">
          <TopicProgressWidget
            topicName={topicNameRu}
            topicStats={topicStats}
            totalSessionsCompleted={totalSessionsCompleted}
            className="results-page__user-widget"
            showCompletionReward
          />
        </aside>
      </div>
    </div>
  );
}
