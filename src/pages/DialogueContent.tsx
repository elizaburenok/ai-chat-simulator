import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../components/Button';
import { InputMessage } from '../../components/InputMessage';
import type { Message } from '../types/trainer';
import './DialogueContent.css';

function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 2h10v16l-5-3-5 3V2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 2l2.5 6.5L19 9l-5 4.5L15 18l-5-3.5L5 18l1-4.5L1 9l6.5-.5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ThumbsUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7 9V4c0-.5.5-1 1-1h1.5c.5 0 1 .5 1 1v5M7 9v7h7v-7l2.5-4.5c.3-.5 0-1-.5-1H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ThumbsDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M13 11V16c0 .5-.5 1-1 1h-1.5c-.5 0-1-.5-1-1v-5M13 11V4h-7v7L3.5 15.5c-.3.5 0 1 .5 1H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface DialogueContentProps {
  topicId: string;
  topicNameRu: string;
  messages: Message[];
  isPaused: boolean;
  canFinish: boolean;
  onSendMessage: (text: string) => void;
  onFinish: () => void;
  onFinishNow: () => void;
  onResume: () => void;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function DialogueContent({
  topicId,
  topicNameRu,
  messages,
  isPaused,
  canFinish,
  onSendMessage,
  onFinish,
  onFinishNow,
  onResume,
}: DialogueContentProps): React.ReactElement {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      onSendMessage(trimmed);
      setInputValue('');
    },
    [onSendMessage]
  );

  function getDateSeparator(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Сегодня';
    if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date);
  }

  const messagesWithDates: { dateLabel?: string; msg: Message }[] = [];
  let lastDateLabel: string | null = null;
  messages.forEach((msg) => {
    const label = getDateSeparator(msg.timestamp);
    if (label !== lastDateLabel) {
      lastDateLabel = label;
      messagesWithDates.push({ dateLabel: label, msg });
    } else {
      messagesWithDates.push({ msg });
    }
  });

  return (
    <div className={`dialogue-content ${isPaused ? 'dialogue-content--paused' : ''}`}>
      <div className="dialogue-content__messages">
        {messagesWithDates.map((item) => (
          <React.Fragment key={item.msg.id}>
            {item.dateLabel && (
              <p className="dialogue-content__date-separator" aria-hidden="true">
                {item.dateLabel}
              </p>
            )}
            <div className={`dialogue-content__message dialogue-content__message--${item.msg.role}`}>
              {item.msg.role === 'specialist' && (
                <div className="dialogue-content__message-avatar dialogue-content__message-avatar--ai">
                  <span className="dialogue-content__message-avatar-letter">А</span>
                </div>
              )}
              <div className="dialogue-content__message-body-wrap">
                {item.msg.role === 'specialist' && (
                  <p className="dialogue-content__message-sender">AI-Ассистент</p>
                )}
                <div className="dialogue-content__message-body">
                  {item.msg.content}
                  {item.msg.role === 'specialist' && (
                    <div className="dialogue-content__message-footer">
                      <a href="#sources" className="dialogue-content__message-sources">
                        Источники
                      </a>
                      <div className="dialogue-content__message-actions" role="group" aria-label="Оценка ответа">
                        <button type="button" className="dialogue-content__message-action" aria-label="В закладки">
                          <BookmarkIcon />
                        </button>
                        <button type="button" className="dialogue-content__message-action" aria-label="Оценить">
                          <StarIcon />
                        </button>
                        <button type="button" className="dialogue-content__message-action" aria-label="Полезно">
                          <ThumbsUpIcon />
                        </button>
                        <button type="button" className="dialogue-content__message-action" aria-label="Бесполезно">
                          <ThumbsDownIcon />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="dialogue-content__message-meta">
                  {item.msg.role === 'client' ? 'Клиент · ' : ''}{formatTime(item.msg.timestamp)}
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="dialogue-content__input-row">
        <InputMessage
          value={inputValue}
          onValueChange={setInputValue}
          onSend={handleSend}
          placeholder="Спросите у AI-Ассистента"
          disabled={isPaused}
          sendDisabled={isPaused || !inputValue.trim()}
          className="dialogue-content__input-message"
          data-testid="send-btn"
        />
      </div>

      {canFinish && !isPaused && (
        <div className="dialogue-content__finish-actions">
          <Button type="Secondary" onClick={onFinish} data-testid="finish-btn">
            Завершить
          </Button>
        </div>
      )}

      {isPaused && (
        <div className="paused-overlay">
          <p style={{ margin: 0, fontFamily: 'var(--font-family-primary)', fontSize: 'var(--font-size-m)', color: 'var(--color-primitive-secondary)' }}>
            Диалог на паузе
          </p>
          <div className="paused-overlay__buttons">
            <Button type="Primary" onClick={onResume} data-testid="resume-btn">
              Продолжить
            </Button>
            <Button type="Secondary" onClick={onFinishNow} data-testid="finish-now-btn">
              Завершить сейчас
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
