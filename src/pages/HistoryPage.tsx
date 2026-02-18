import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarGraph, type BarGraphDataPoint } from '../../components/BarGraph';
import type { ProgressLevel } from '../../components/VerticalMarker';
import { loadHistoryEntries } from '../lib/historyStorage';
import { getEntryAverageScore } from '../lib/resultsAggregates';
import './HistoryPage.css';

const PROGRESS_LEVELS: ProgressLevel[] = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];

function countToProgressLevel(count: number, maxCount: number): ProgressLevel {
  if (maxCount === 0) return '0%';
  const p = Math.round((count / maxCount) * 10) * 10;
  const clamped = Math.min(100, Math.max(0, p));
  return PROGRESS_LEVELS[clamped / 10] ?? '0%';
}

export function HistoryPage(): React.ReactElement {
  const navigate = useNavigate();
  const entries = loadHistoryEntries();

  const { topTopics, barGraphData } = useMemo(() => {
    const byTopic = new Map<string, { topicNameRu: string; count: number }>();
    for (const entry of entries) {
      const existing = byTopic.get(entry.topicId);
      if (existing) {
        existing.count += 1;
      } else {
        byTopic.set(entry.topicId, { topicNameRu: entry.topicNameRu, count: 1 });
      }
    }
    const sorted = [...byTopic.entries()]
      .map(([, v]) => v)
      .sort((a, b) => b.count - a.count || 0);
    const topTopics = sorted.slice(0, 5);
    const maxCount = topTopics[0]?.count ?? 0;
    const barGraphData: BarGraphDataPoint[] = topTopics.map(({ topicNameRu, count }) => ({
      label: topicNameRu,
      progressLevel: countToProgressLevel(count, maxCount),
    }));
    return { topTopics, barGraphData };
  }, [entries]);

  function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  }

  return (
    <div className="history-page">
      <div className="history-page__content">
        {entries.length > 0 && topTopics.length > 0 && (
          <section className="history-page__chart" aria-labelledby="history-chart-heading">
            <h2 id="history-chart-heading" className="history-page__chart-title">Популярные темы</h2>
            <BarGraph data={barGraphData} data-testid="history-top-topics-chart" />
          </section>
        )}

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
                    {formatDate(entry.completedAt)} · Средний балл: {getEntryAverageScore(entry)}
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
