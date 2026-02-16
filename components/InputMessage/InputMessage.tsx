import React, { useState, useCallback } from 'react';
import './InputMessage.css';

export interface InputMessageProps {
  /** Current value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Placeholder when empty */
  placeholder?: string;
  /** Send button disabled (e.g. validation, loading) */
  sendDisabled?: boolean;
  /** Input and actions disabled */
  disabled?: boolean;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Callback when send is clicked */
  onSend?: (value: string) => void;
  /** Additional class name */
  className?: string;
  /** HTML data attribute */
  'data-testid'?: string;
}

export const InputMessage: React.FC<InputMessageProps> = (props) => {
  const {
    value: controlledValue,
    defaultValue = '',
    placeholder = 'Сообщение...',
    sendDisabled = false,
    disabled = false,
    onValueChange,
    onSend,
    className,
    'data-testid': dataTestId,
  } = props;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const hasText = value.trim().length > 0;
  const canSend = hasText && !sendDisabled && !disabled;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const handleSend = useCallback(() => {
    if (!canSend) return;
    onSend?.(value);
  }, [canSend, value, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const showSend = hasText;

  const blockClass = 'input-message';
  const modifiers: string[] = [];
  if (disabled) modifiers.push(`${blockClass}--disabled`);
  if (hasText) modifiers.push(`${blockClass}--has-text`);
  if (canSend) modifiers.push(`${blockClass}--can-send`);
  const rootClassName = [blockClass, ...modifiers, className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName} data-testid={dataTestId}>
      <div className="input-message__inner">
        <input
          type="text"
          className="input-message__field"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Сообщение"
        />

        <div className="input-message__suffix">
          {showSend && (
            <button
              type="button"
              className="input-message__send"
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Отправить"
            >
              <SendIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 16V4M4 10l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default InputMessage;
