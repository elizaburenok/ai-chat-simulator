import React from 'react';
import './OptionSelectCard.css';

export interface OptionSelectCardItem {
  id: string;
  label: string;
  /** Single character shown in the avatar circle (e.g. "T") */
  avatarLetter?: string;
  /** Background color for avatar circle (default from design: #E0BBE4) */
  avatarBgColor?: string;
  /** Text color for avatar letter (default from design: #6F3899) */
  avatarLetterColor?: string;
  disabled?: boolean;
}

export interface OptionSelectCardProps {
  /** Header title (e.g. "Text XL") */
  title: string;
  /** List of selectable options */
  items: OptionSelectCardItem[];
  /** ID of the currently selected item */
  selectedId: string | null;
  /** Label for the bottom action button (e.g. "Text S") */
  buttonLabel: string;
  /** Callback when an option row is selected */
  onSelect?: (item: OptionSelectCardItem) => void;
  /** Callback when the bottom button is clicked */
  onConfirm?: () => void;
  /** Callback when header (or chevron) is clicked (e.g. expand/collapse) */
  onHeaderClick?: () => void;
  /** Additional CSS class name */
  className?: string;
  /** HTML data attributes */
  'data-testid'?: string;
}

function getClassNames(props: OptionSelectCardProps): string {
  const { className } = props;
  const classes = ['option-select-card'];
  if (className) classes.push(className);
  return classes.join(' ');
}

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <path
      d="M8 5l5 5-5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const OptionSelectCard: React.FC<OptionSelectCardProps> = (props) => {
  const {
    title,
    items,
    selectedId,
    buttonLabel,
    onSelect,
    onConfirm,
    onHeaderClick,
    'data-testid': dataTestId,
  } = props;

  const classNames = getClassNames(props);

  return (
    <div className={classNames} role="group" aria-label={title} data-testid={dataTestId}>
      <div
        className="option-select-card__header"
        onClick={onHeaderClick}
        role={onHeaderClick ? 'button' : undefined}
        tabIndex={onHeaderClick ? 0 : undefined}
        onKeyDown={
          onHeaderClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onHeaderClick();
                }
              }
            : undefined
        }
      >
        <span className="option-select-card__title">{title}</span>
        {onHeaderClick && (
          <span className="option-select-card__chevron">
            <ChevronRight className="option-select-card__chevron-icon" />
          </span>
        )}
      </div>

      <div className="option-select-card__list" role="radiogroup" aria-label={title}>
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          const isDisabled = item.disabled;
          const bg = item.avatarBgColor ?? '#E0BBE4';
          const letterColor = item.avatarLetterColor ?? '#6F3899';
          const letter = item.avatarLetter ?? (item.label.charAt(0) || '?');

          return (
            <div
              key={item.id}
              className="option-select-card__row"
              onClick={() => !isDisabled && onSelect?.(item)}
              role="radio"
              aria-checked={isSelected}
              aria-disabled={isDisabled}
              tabIndex={isDisabled ? -1 : 0}
              onKeyDown={(e) => {
                if (isDisabled) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect?.(item);
                }
              }}
            >
              <div
                className="option-select-card__avatar"
                style={{ backgroundColor: bg }}
                aria-hidden
              >
                <span className="option-select-card__avatar-letter" style={{ color: letterColor }}>
                  {letter}
                </span>
              </div>
              <span className="option-select-card__label">{item.label}</span>
              <div
                className={`option-select-card__radio ${isSelected ? 'option-select-card__radio--selected' : ''} ${isDisabled ? 'option-select-card__radio--disabled' : ''}`}
                aria-hidden
              >
                {isSelected && (
                  <span className="option-select-card__radio-dot" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="option-select-card__button"
        onClick={onConfirm}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default OptionSelectCard;
