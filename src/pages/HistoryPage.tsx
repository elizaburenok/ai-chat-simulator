import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loadHistoryEntries } from '../lib/historyStorage';
import './HistoryPage.css';

export function HistoryPage(): React.ReactElement {
  const navigate = useNavigate();
  const entries = loadHistoryEntries();

  function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  }

  function getAverageScore(entry: (typeof entries)[0]): number {
    const { block1, block2, block3 } = entry.result;
    return Math.round((block1.score + block2.score + block3.score) / 3);
  }

  return (
    <div className="history-page">
      <div className="history-page__content">
        <h1 className="history-page__title">История сессий</h1>

        {entries.length === 0 ? (
          <p className="history-page__empty">Пока нет завершённых сессий. Завершите диалог в тренажёре, чтобы увидеть результаты здесь.</p>
        ) : (
          <ul className="history-page__list" role="list">
            {entries.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  className="history-page__item"
                  onClick={() => navigate(`/results?id=${entry.id}`, { state: { historyEntryId: entry.id } })}
                  data-testid={`history-item-${entry.id}`}
                >
                  <span className="history-page__item-topic">{entry.topicNameRu}</span>
                  <span className="history-page__item-meta">
                    {formatDate(entry.completedAt)} · Средний балл: {getAverageScore(entry)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="history-page__actions">
          <button
            type="button"
            className="history-page__back"
            onClick={() => navigate('/')}
          >
            На главную
          </button>
          <button
            type="button"
            className="history-page__trainer"
            onClick={() => navigate('/trainer')}
          >
            К тренажёру
          </button>
        </div>
      </div>
    </div>
  );
}
