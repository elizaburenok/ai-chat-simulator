import React from 'react';
import { Button } from '../../components/Button';
import './RulesModal.css';

const RULES_FULL =
  'Имитация текстового диалога. Пишите ответы по стандартам банка. Завершайте по кнопке.\n\n' +
  'В тренажёре вы практикуете общение с клиентом в текстовом формате. Отвечайте так, как предписывают внутренние стандарты банка. ' +
  'Диалог завершается нажатием кнопки «Завершить» после последнего сообщения или «Завершить сейчас» при досрочном окончании.';

export interface RulesModalProps {
  open: boolean;
  onClose: () => void;
}

export function RulesModal({ open, onClose }: RulesModalProps): React.ReactElement | null {
  if (!open) return null;

  return (
    <div className="rules-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="rules-modal-title">
      <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
        <h2 id="rules-modal-title" className="rules-modal__title">
          Правила тренажёра
        </h2>
        <p className="rules-modal__text">{RULES_FULL}</p>
        <div className="rules-modal__close">
          <Button type="Primary" onClick={onClose}>
            Понятно
          </Button>
        </div>
      </div>
    </div>
  );
}
