import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { DonutChart } from '../../components/DonutChart';
import { UserInfoWidget } from '../../components/UserInfoWidget';
import type { BlockScores } from '../types/results';
import './ResultsPage.css';

const DEFAULT_BLOCK_SCORES: BlockScores = {
  block1: 85,
  block2: 78,
  block3: 82,
};

const BLOCK1_LABEL = 'База знаний';
const BLOCK2_LABEL = 'Общий тон ответов и соответствие Tone of Voice';
const BLOCK3_LABEL = 'Соблюдение орфографических норм';

const BLOCK1_ITEMS = [
  'База знаний',
  'Tone of Voice',
  'Редакционная политика',
  'Сильные стороны и зоны роста',
  'Рекомендации',
  'Анализ фактических ошибок',
];

const BLOCK2_TITLE = 'Общий тон ответов и соответствие Tone of Voice';
const BLOCK2_ITEMS = [
  'Ключевые характеристики',
  'Стиль текста',
  'Практика Шаг Вперед',
  'Лингвистические и стилистические правила',
  'Рекомендации',
];

const BLOCK3_TITLE = 'Соблюдение орфографических норм';
const BLOCK3_ITEMS = [
  'Соблюдение пунктуационных норм',
  'Соблюдение синтаксических норм',
  'Буква "ё"',
  'Знаки, символы',
  'Кавычки и тире',
  'Числа',
  'Местоимения',
  'Структурирование и форматирование',
  'Общее впечатление и оценка',
  'Пример исправления кавычек',
  'Оценка',
];

export function ResultsPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisError, setAnalysisError] = useState(false);

  const blockScores: BlockScores = (location.state as { blockScores?: BlockScores } | null)
    ?.blockScores ?? DEFAULT_BLOCK_SCORES;

  const chartData = useMemo(() => {
    const average = Math.round((blockScores.block1 + blockScores.block2 + blockScores.block3) / 3);
    return {
      segments: [
        { label: BLOCK1_LABEL, value: blockScores.block1, color: 'var(--color-primitive-success)', displayValue: String(blockScores.block1) },
        { label: BLOCK2_LABEL, value: blockScores.block2, color: 'var(--color-primitive-warning)', displayValue: String(blockScores.block2) },
        { label: BLOCK3_LABEL, value: blockScores.block3, color: 'var(--color-category-sand)', displayValue: String(blockScores.block3) },
      ],
      centerValue: String(average),
      centerLabel: 'средний балл',
    };
  }, [blockScores]);

  const handleClose = () => {
    navigate('/');
  };

  const handleNewSession = () => {
    navigate('/trainer');
  };

  const handleRetry = () => {
    setAnalysisError(false);
  };

  return (
    <div className="results-page">
      <div className="results-page__content">
        <div className="results-page__main">
          <h1 className="results-page__title">Результаты анализа</h1>

          {analysisError ? (
        <>
          <div className="results-page__error">Попробуйте позже</div>
          <div className="results-page__actions">
            <Button type="Primary" onClick={handleRetry}>
              Повторить
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Results summary with donut chart */}
          <section className="results-page__chart" aria-labelledby="chart-title">
            <h2 id="chart-title" className="results-page__block-title">
              Сводка результатов
            </h2>
            <DonutChart
              segments={chartData.segments}
              centerValue={chartData.centerValue}
              centerLabel={chartData.centerLabel}
              size={160}
              showLegend
              legendPosition="below"
              data-testid="results-donut-chart"
            />
          </section>

          {/* First block */}
          <section className="results-page__block" aria-labelledby="block1-title">
            <h2 id="block1-title" className="results-page__block-title">
              Блок 1
            </h2>
            <div className="results-page__block-content">
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6x)' }}>
                {BLOCK1_ITEMS.map((item) => (
                  <li key={item} style={{ marginBottom: 'var(--spacing-1x)' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Second block */}
          <section className="results-page__block" aria-labelledby="block2-title">
            <h2 id="block2-title" className="results-page__block-title">
              {BLOCK2_TITLE}
            </h2>
            <div className="results-page__block-content">
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6x)' }}>
                {BLOCK2_ITEMS.map((item) => (
                  <li key={item} style={{ marginBottom: 'var(--spacing-1x)' }}>
                    {item}
                  </li>
                ))}
              </ul>
              <p>Здесь отображаются ключевые характеристики тона, стиль текста и рекомендации по соответствию Tone of Voice.</p>
            </div>
          </section>

          {/* Third block */}
          <section className="results-page__block" aria-labelledby="block3-title">
            <h2 id="block3-title" className="results-page__block-title">
              {BLOCK3_TITLE}
            </h2>
            <div className="results-page__block-content">
              <ul style={{ margin: 0, paddingLeft: 'var(--spacing-6x)' }}>
                {BLOCK3_ITEMS.map((item) => (
                  <li key={item} style={{ marginBottom: 'var(--spacing-1x)' }}>
                    {item}
                  </li>
                ))}
              </ul>
              <p>Общее впечатление и оценка соблюдения орфографических и пунктуационных норм.</p>
            </div>
          </section>

          <div className="results-page__actions">
            <Button type="Primary" onClick={handleClose} data-testid="results-close">
              Закрыть
            </Button>
            <Button type="Secondary" onClick={handleNewSession} data-testid="results-new-session">
              Новая сессия
            </Button>
          </div>
        </>
      )}
        </div>

        <aside className="results-page__right" aria-label="Данные пользователя">
          <UserInfoWidget className="results-page__user-widget" />
        </aside>
      </div>
    </div>
  );
}
