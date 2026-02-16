import React from 'react';
import { Cell } from '../../components/Cell';
import { topicsData, type Topic } from '../../data/topics';
import { RulesModal } from '../components/RulesModal';
import './WelcomeContent.css';

const RULES_SHORT =
  'Имитация текстового диалога. Пишите ответы по стандартам банка. Завершайте по кнопке.';

function formatProgress(topic: Topic): string {
  const { sessionsPercent, attemptsCount } = topic.progress;
  return `${sessionsPercent}% сессий, ${attemptsCount} попыток`;
}

export interface WelcomeContentProps {
  sessionNumber: number;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  rulesModalOpen: boolean;
  onOpenRules: () => void;
  onCloseRules: () => void;
}

export function WelcomeContent({
  sessionNumber,
  selectedTopicId,
  onSelectTopic,
  rulesModalOpen,
  onOpenRules,
  onCloseRules,
}: WelcomeContentProps): React.ReactElement {
  return (
    <div className="welcome-content welcome-content--chat">
      <div className="welcome-content__scroll">
        <h1 className="welcome-content__header">Сессия #{sessionNumber}</h1>
        <p className="welcome-content__rules">{RULES_SHORT}</p>
        <p className="welcome-content__hint" aria-live="polite">
          Выберите тему в списке ниже — сессия начнётся сразу.
        </p>

        <div className="welcome-content__topics">
          {topicsData.map((topic) => (
            <div
              key={topic.id}
              className={`topic-row ${selectedTopicId === topic.id ? 'topic-row--selected' : ''}`}
            >
              <Cell
                size="M"
                variant="default"
                label={topic.descriptionShort}
                onClick={() => onSelectTopic(topic.id)}
                data-testid={`topic-${topic.id}`}
                className="topic-row__cell"
              >
                {topic.nameRu}
              </Cell>
              <div className="topic-row__progress">{formatProgress(topic)}</div>
            </div>
          ))}
        </div>
      </div>

      <RulesModal open={rulesModalOpen} onClose={onCloseRules} />
    </div>
  );
}
