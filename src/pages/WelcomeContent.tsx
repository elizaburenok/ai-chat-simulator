import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Cell } from '../../components/Cell';
import { NavigationBar } from '../../components/NavigationBar';
import { SearchInput } from '../../components/SearchInput';
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
  hideProgress = false,
}: {
  topic: Topic;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  /** When true, progress bar is not rendered (e.g. in "Недавние диалоги" widget) */
  hideProgress?: boolean;
}): React.ReactElement {
  const faceIcon = getTopicFaceIcon(topic);
  const hasSimulatorProgress = !hideProgress && topic.progress.sessionsPercent > 0;

  return (
    <div className={cn('topic-row', selectedTopicId === topic.id && 'topic-row--selected')}>
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

const TOPIC_GROUP_TITLES = [
  'Знания',
  'Бережём друг друга',
  'Отношение к клиенту',
  'Не ждём спокойной жизни',
] as const;

const GROUP_COUNT = TOPIC_GROUP_TITLES.length;

/** Distribute topics into 4 groups in arbitrary order (by index). */
function groupTopics<T>(topics: T[]): T[][] {
  const groups: T[][] = Array.from({ length: GROUP_COUNT }, () => []);
  topics.forEach((topic, index) => {
    groups[index % GROUP_COUNT].push(topic);
  });
  return groups;
}

function matchesSearch(topic: Topic, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  return topic.nameRu.toLowerCase().includes(q);
}

export function WelcomeContent({
  selectedTopicId,
  onSelectTopic,
  rulesModalOpen,
  onOpenRules,
  onCloseRules,
  recommendedTopics = [],
}: WelcomeContentProps): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');

  // Show all topics except those already shown in sidebar (topicsInProgress) or recommended section
  const recommendedTopicIds = new Set(recommendedTopics.map((t) => t.id));
  const inProgressTopicIds = new Set(topicsInProgress.map((t) => t.id));
  const allTopicsBase = topicsData.filter(
    (topic) => !recommendedTopicIds.has(topic.id) && !inProgressTopicIds.has(topic.id)
  );

  const filteredRecommended = useMemo(
    () => recommendedTopics.filter((t) => matchesSearch(t, searchQuery)),
    [recommendedTopics, searchQuery]
  );
  const filteredAllTopics = useMemo(
    () => allTopicsBase.filter((t) => matchesSearch(t, searchQuery)),
    [allTopicsBase, searchQuery]
  );
  const topicsByGroup = useMemo(
    () => groupTopics(filteredAllTopics),
    [filteredAllTopics]
  );

  return (
    <div className="welcome-content welcome-content--chat">
      <div className="welcome-content__scroll">
        <div className="welcome-content__main">
          <div className="welcome-content__search">
            <SearchInput
              placeholder="Найти тему по названию"
              value={searchQuery}
              onValueChange={setSearchQuery}
              size="m"
              variant="filled"
              aria-label="Поиск по темам"
              data-testid="welcome-topic-search"
            />
          </div>
          <div className="welcome-content__blocks">
            {filteredRecommended.length > 0 && (
              <NavigationBar
                hasTextBlock
                title="Рекомендовано для вас"
                hasItems
                items={filteredRecommended.slice(0, 3).map((topic) => ({
                  id: topic.id,
                  label: topic.nameRu,
                  onClick: () => onSelectTopic(topic.id),
                  active: selectedTopicId === topic.id,
                }))}
                className="welcome-content__recommended-bar"
                data-testid="welcome-recommended-bar"
              />
            )}
          </div>
          {TOPIC_GROUP_TITLES.map((groupTitle, groupIndex) => {
            const groupTopicsList = topicsByGroup[groupIndex];
            if (groupTopicsList.length === 0) return null;
            return (
              <section
                key={groupTitle}
                className="welcome-content__topic-group"
                aria-labelledby={`group-heading-${groupIndex}`}
              >
                <div id={`group-heading-${groupIndex}`} className="welcome-content__group-header">
                  <Cell size="S" variant="default">
                    {groupTitle}
                  </Cell>
                </div>
                <div className="welcome-content__topics">
                  {groupTopicsList.map((topic) => (
                    <TopicRow
                      key={topic.id}
                      topic={topic}
                      selectedTopicId={selectedTopicId}
                      onSelectTopic={onSelectTopic}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <RulesModal open={rulesModalOpen} onClose={onCloseRules} />
    </div>
  );
}