import React from 'react';
import { Cell } from '../../components/Cell';
import { Widget } from '../../components/Widget';
import { topicsData, type Topic } from '../../data/topics';
import { RulesModal } from '../components/RulesModal';
import HappyFaceIcon from '../icons/HappyFace.svg';
import UnhappyFaceIcon from '../icons/UnhappyFace.svg';
import './WelcomeContent.css';

const FACE_SIZE = 34;
const SCORE_THRESHOLD = 8.5;

function getTopicFaceIcon(topic: Topic): string {
  const avg = topic.progress.averageScore;
  if (avg !== undefined && avg < SCORE_THRESHOLD) {
    return UnhappyFaceIcon;
  }
  return HappyFaceIcon;
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
  const faceIcon = getTopicFaceIcon(topic);
  const hasSimulatorProgress = topic.progress.sessionsPercent > 0;

  return (
    <div className={`topic-row ${selectedTopicId === topic.id ? 'topic-row--selected' : ''}`}>
      <Cell
        size="M"
        variant="default"
        label={topic.descriptionShort}
        icon={
          <img
            src={faceIcon}
            alt=""
            width={FACE_SIZE}
            height={FACE_SIZE}
            className="topic-row__avatar"
          />
        }
        onClick={() => onSelectTopic(topic.id)}
        data-testid={`topic-${topic.id}`}
        className="topic-row__cell"
      >
        {topic.nameRu}
      </Cell>
      {hasSimulatorProgress && (
        <div className="topic-row__progress-wrap" role="progressbar" aria-valuenow={topic.progress.sessionsPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Прогресс по теме">
          <div className="topic-row__progress-bar" style={{ width: `${topic.progress.sessionsPercent}%` }} />
        </div>
      )}
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

const topicsInProgress = topicsData.filter((t) => t.progress.sessionsPercent > 0);

export function WelcomeContent({
  selectedTopicId,
  onSelectTopic,
  rulesModalOpen,
  onOpenRules,
  onCloseRules,
  recommendedTopics = [],
}: WelcomeContentProps): React.ReactElement {
  // Show all topics except those already shown in sidebar (topicsInProgress) or recommended section
  const recommendedTopicIds = new Set(recommendedTopics.map((t) => t.id));
  const inProgressTopicIds = new Set(topicsInProgress.map((t) => t.id));
  const allTopics = topicsData.filter(
    (topic) => !recommendedTopicIds.has(topic.id) && !inProgressTopicIds.has(topic.id)
  );

  return (
    <div className="welcome-content welcome-content--chat">
      <div className="welcome-content__scroll">
        <div className="welcome-content__main">
          <div className="welcome-content__blocks">
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
          </div>
          <h2 className="welcome-content__section-header">Все темы</h2>
          <div className="welcome-content__topics">
            {allTopics.map((topic) => (
              <TopicRow
                key={topic.id}
                topic={topic}
                selectedTopicId={selectedTopicId}
                onSelectTopic={onSelectTopic}
              />
            ))}
          </div>
        </div>
        {topicsInProgress.length > 0 && (
          <aside className="welcome-content__sidebar" aria-label="Недавно открытые">
            <Widget title="Недавно открытые">
              {topicsInProgress.map((topic) => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  selectedTopicId={selectedTopicId}
                  onSelectTopic={onSelectTopic}
                />
              ))}
            </Widget>
          </aside>
        )}
      </div>

      <RulesModal open={rulesModalOpen} onClose={onCloseRules} />
    </div>
  );
}