import React from 'react';
import { Cell } from '../../components/Cell';
import { topicsData, type Topic } from '../../data/topics';
import { RulesModal } from '../components/RulesModal';
import './WelcomeContent.css';

function formatProgress(topic: Topic): string {
  const { sessionsPercent, attemptsCount } = topic.progress;
  return `${sessionsPercent}% сессий, ${attemptsCount} попыток`;
}

function TopicRow({
  topic,
  selectedTopicId,
  onSelectTopic,
}: {
  topic: Topic;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
}): React.ReactElement {
  return (
    <div className={`topic-row ${selectedTopicId === topic.id ? 'topic-row--selected' : ''}`}>
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
  );
}

export interface WelcomeContentProps {
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  rulesModalOpen: boolean;
  onOpenRules: () => void;
  onCloseRules: () => void;
  /** 1–4 topics recommended for the user's role and grade. Omit or empty = no block. */
  recommendedTopics?: Topic[];
}

export function WelcomeContent({
  selectedTopicId,
  onSelectTopic,
  rulesModalOpen,
  onOpenRules,
  onCloseRules,
  recommendedTopics = [],
}: WelcomeContentProps): React.ReactElement {
  return (
    <div className="welcome-content welcome-content--chat">
      <div className="welcome-content__scroll">
        {recommendedTopics.length > 0 && (
          <section className="welcome-content__recommended" aria-labelledby="recommended-heading">
            <h2 id="recommended-heading" className="welcome-content__recommended-header">
              Рекомендовано для вас
            </h2>
            <div className="welcome-content__recommended-topics">
              {recommendedTopics.map((topic) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  selectedTopicId={selectedTopicId}
                  onSelectTopic={onSelectTopic}
                />
              ))}
            </div>
          </section>
        )}
        <h2 className="welcome-content__section-header">Все темы</h2>
        <div className="welcome-content__topics">
          {topicsData.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              selectedTopicId={selectedTopicId}
              onSelectTopic={onSelectTopic}
            />
          ))}
        </div>
      </div>

      <RulesModal open={rulesModalOpen} onClose={onCloseRules} />
    </div>
  );
}
