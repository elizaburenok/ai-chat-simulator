import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../components/Button';
import { InputMessage } from '../../components/InputMessage';
import type { Message } from '../types/trainer';
import './DialogueContent.css';

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
              <div className="dialogue-content__message-body-wrap">
                <div className="dialogue-content__message-body">
                  {item.msg.content}
                    {item.msg.role === 'specialist' && (
                      <div className="dialogue-content__message-footer">
                        <a href="#sources" className="dialogue-content__message-sources">
                          Источники
                        </a>
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
          placeholder="Написать ответ клиенту"
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
