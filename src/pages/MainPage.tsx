import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';

const TrainerIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function MainPage(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="main-page" style={{ padding: 'var(--spacing-4x, 24px)', fontFamily: 'var(--font-family-primary, sans-serif)' }}>
      <h1 className="main-page__title" style={{ margin: '0 0 var(--spacing-4x, 24px)', fontSize: 'var(--font-size-l, 22px)', fontWeight: 'var(--font-weight-demi-bold, 600)', color: 'var(--color-primitive-primary)' }}>
        AI тренажёр
      </h1>
      {/* Opens chat (trainer) immediately; topic selection is inside the chat (Welcome), no separate screen */}
      <ServiceCard
        title="Практика диалогов с клиентами"
        subtitle="Тренажёр текстовой поддержки по стандартам банка"
        icon={<TrainerIcon />}
        iconBgColor="var(--color-bg-neutral-2, #eeeeee)"
        onClick={() => navigate('/trainer')}
        data-testid="trainer-entry"
      />
    </div>
  );
}
