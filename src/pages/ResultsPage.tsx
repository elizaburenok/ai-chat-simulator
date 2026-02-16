import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { FeedbackCard } from '../../components/FeedbackCard';
import './ResultsPage.css';

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
  const [analysisError, setAnalysisError] = useState(false);

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
            <div className="results-page__card">
              <FeedbackCard
                name="Сильные стороны и зоны роста"
                date={new Date()}
                author="Тренажёр"
                strengths="Корректное приветствие, соблюдение тона, вежливое обращение."
                growthZone="Рекомендуется уточнять детали перед предложением решения. Обратить внимание на пунктуацию в сложных предложениях."
                rating="Хорошо справляется"
                primaryAction={{ label: 'Закрыть', onClick: handleClose }}
                secondaryAction={{ label: 'Новая сессия', onClick: handleNewSession }}
              />
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
  );
}
