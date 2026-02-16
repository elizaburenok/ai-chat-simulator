import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import { mainPageSections } from '../../data/mainPageCards';

import Avatar from '../avatar images/Avatar.svg';
import Avatar1 from '../avatar images/Avatar-1.svg';
import Avatar2 from '../avatar images/Avatar-2.svg';
import Avatar3 from '../avatar images/Avatar-3.svg';
import Avatar4 from '../avatar images/Avatar-4.svg';
import Avatar5 from '../avatar images/Avatar-5.svg';
import Avatar6 from '../avatar images/Avatar-6.svg';
import Avatar7 from '../avatar images/Avatar-7.svg';
import Avatar8 from '../avatar images/Avatar-8.svg';
import Avatar9 from '../avatar images/Avatar-9.svg';

import './MainPage.css';

const AVATAR_MAP: Record<string, string> = {
  'Avatar.svg': Avatar,
  'Avatar-1.svg': Avatar1,
  'Avatar-2.svg': Avatar2,
  'Avatar-3.svg': Avatar3,
  'Avatar-4.svg': Avatar4,
  'Avatar-5.svg': Avatar5,
  'Avatar-6.svg': Avatar6,
  'Avatar-7.svg': Avatar7,
  'Avatar-8.svg': Avatar8,
  'Avatar-9.svg': Avatar9,
};

export function MainPage(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      {mainPageSections.map((section) => (
        <section key={section.title} className="main-page__section">
          <h1 className="main-page__section-title">{section.title}</h1>
          <div className="main-page__grid">
            {section.cards.map((card) => (
              <ServiceCard
                key={card.id}
                title={card.title}
                subtitle={card.subtitle}
                avatarSrc={AVATAR_MAP[card.avatarId]}
                onClick={card.path ? () => navigate(card.path!) : undefined}
                data-testid={card.testId}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
