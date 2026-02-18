import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/Button';
import { UserInfoWidget } from '../../components/UserInfoWidget';
import { completionReward } from '../../data/completionReward';
import { getHistoryEntryById } from '../lib/historyStorage';
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

function resolveResult(
  locationState: unknown,
  idFromUrl: string | null
): { result: AnalysisResult; topicNameRu?: string; transcription?: Message[] } | null {
  const state = locationState as { historyEntryId?: string; result?: AnalysisResult; blockScores?: BlockScores } | null;
  const historyId = state?.historyEntryId ?? idFromUrl;
  if (historyId) {
    const entry = getHistoryEntryById(historyId);
    if (entry) {
      return {
        result: entry.result,
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
  const [showTranscription, setShowTranscription] = useState(false);
  const resolved = useMemo(
    () => resolveResult(location.state, idFromUrl),
    [location.state, idFromUrl]
  );

  const handleClose = () => {
    navigate('/');
  };

  const handleNewSession = () => {
    navigate('/trainer');
  };

  const handleRetry = () => {
    setAnalysisError(false);
  };

  const handleHistory = () => {
    navigate('/history');
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
          <aside className="results-page__right" aria-label="Данные пользователя">
            <UserInfoWidget className="results-page__user-widget" />
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
                <Button type="Secondary" onClick={handleHistory}>
                  История сессий
                </Button>
              </div>
            </footer>
          </div>
          <aside className="results-page__right" aria-label="Данные пользователя">
            <UserInfoWidget className="results-page__user-widget" />
          </aside>
        </div>
      </div>
    );
  }

  const { result, topicNameRu, transcription } = resolved;

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

            <section className="results-page__reward" aria-labelledby="results-reward-heading">
              <h2 id="results-reward-heading" className="results-page__reward-title">
                Награда за прохождение
              </h2>
              <img
                src={completionReward.image}
                alt=""
                width={64}
                height={64}
                className="results-page__reward-image"
              />
              <p className="results-page__reward-description">{completionReward.description}</p>
            </section>

            {transcription && transcription.length > 0 && (
              <section className="results-page__transcription" aria-labelledby="transcription-title">
                <button
                  type="button"
                  id="transcription-title"
                  className="results-page__transcription-toggle"
                  onClick={() => setShowTranscription((s) => !s)}
                  aria-expanded={showTranscription}
                >
                  {showTranscription ? 'Скрыть диалог' : 'Просмотр диалога'}
                </button>
                {showTranscription && (
                  <div className="results-page__transcription-content">
                    {transcription.map((msg) => (
                      <div
                        key={msg.id}
                        className={`results-page__transcription-msg results-page__transcription-msg--${msg.role}`}
                      >
                        <span className="results-page__transcription-role">
                          {msg.role === 'client' ? 'Клиент' : 'Специалист'}
                        </span>
                        <span className="results-page__transcription-meta">
                          {formatTime(msg.timestamp)}
                        </span>
                        <p className="results-page__transcription-body">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          <footer className="results-page__footer" aria-label="Действия страницы">
            <div className="results-page__footer-actions">
              <Button type="Primary" onClick={handleClose} data-testid="results-close">
                Закрыть
              </Button>
              <Button type="Secondary" onClick={handleNewSession} data-testid="results-new-session">
                Новая сессия
              </Button>
              <Button type="Secondary" onClick={handleHistory}>
                История сессий
              </Button>
            </div>
          </footer>
        </div>

        <aside className="results-page__right" aria-label="Данные пользователя">
          <UserInfoWidget className="results-page__user-widget" />
        </aside>
      </div>
    </div>
  );
}
