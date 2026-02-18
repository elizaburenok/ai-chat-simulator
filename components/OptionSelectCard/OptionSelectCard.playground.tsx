import React, { useState } from 'react';
import { OptionSelectCard, type OptionSelectCardItem } from './OptionSelectCard';

const defaultItems: OptionSelectCardItem[] = [
  { id: 'm', label: 'Text M', avatarLetter: 'T' },
  { id: 'l', label: 'Text L', avatarLetter: 'T' },
  { id: 's', label: 'Text S', avatarLetter: 'T' },
];

/**
 * Playground for OptionSelectCard — test in isolation.
 * Route: /playground/option-select-card
 */
export function OptionSelectCardPlayground(): React.ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>('m');
  const [lastAction, setLastAction] = useState<string>('');

  return (
    <div
      style={{
        padding: '24px',
        maxWidth: '640px',
        margin: '0 auto',
        fontFamily: 'var(--font-family-primary), sans-serif',
        background: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: '8px', fontSize: '20px', fontWeight: 600, color: '#191919' }}>
        OptionSelectCard — Playground
      </h1>
      <p style={{ color: '#676767', marginBottom: '24px', fontSize: '14px' }}>
        Header + radio list + confirm button. Hover rows and button to see states.
      </p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#191919' }}>
          Default (with header click)
        </h2>
        <OptionSelectCard
          title="Text XL"
          items={defaultItems}
          selectedId={selectedId}
          buttonLabel="Text S"
          onSelect={(item) => {
            setSelectedId(item.id);
            setLastAction(`Selected: ${item.label}`);
          }}
          onConfirm={() => setLastAction('Confirmed')}
          onHeaderClick={() => setLastAction('Header clicked')}
        />
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#191919' }}>
          No header click (title only)
        </h2>
        <OptionSelectCard
          title="Choose size"
          items={defaultItems}
          selectedId={selectedId}
          buttonLabel="Apply"
          onSelect={(item) => setSelectedId(item.id)}
          onConfirm={() => setLastAction('Apply clicked')}
        />
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#191919' }}>
          Custom avatar colors
        </h2>
        <OptionSelectCard
          title="Variants"
          items={[
            { id: 'a', label: 'Option A', avatarLetter: 'A', avatarBgColor: '#d6cef3', avatarLetterColor: '#835de1' },
            { id: 'b', label: 'Option B', avatarLetter: 'B', avatarBgColor: '#e2ddf6', avatarLetterColor: '#6F3899' },
            { id: 'c', label: 'Option C', avatarLetter: 'C', avatarBgColor: '#E0BBE4', avatarLetterColor: '#6F3899' },
          ]}
          selectedId="b"
          buttonLabel="Select"
          onSelect={() => {}}
          onConfirm={() => setLastAction('Custom variant confirmed')}
        />
      </section>

      {lastAction && (
        <p
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#efedf8',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#191919',
          }}
        >
          Last action: <strong>{lastAction}</strong>
        </p>
      )}
    </div>
  );
}

export default OptionSelectCardPlayground;
