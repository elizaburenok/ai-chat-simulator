/**
 * Main page card definitions for Моя деятельность and Эффективность sections.
 * Avatar mapping follows Figma design node 54-5334.
 */

export interface MainPageCard {
  id: string;
  title: string;
  subtitle: string;
  /** Avatar filename (e.g. 'Avatar.svg', 'Avatar-1.svg') */
  avatarId: string;
  /** Navigate to this path on click (optional) */
  path?: string;
  /** data-testid for the card */
  testId?: string;
}

export interface MainPageSection {
  title: string;
  cards: MainPageCard[];
}

export const mainPageSections: MainPageSection[] = [
  {
    title: 'Моя деятельность',
    cards: [
      {
        id: 'plans',
        title: 'Планы',
        subtitle: 'Работа с планами',
        avatarId: 'Avatar.svg',
      },
      {
        id: 'participants',
        title: 'Участники',
        subtitle: 'Работа с участниками погружения',
        avatarId: 'Avatar-1.svg',
      },
      {
        id: 'skills',
        title: 'Скиллы',
        subtitle: 'Проверка скиллов',
        avatarId: 'Avatar-2.svg',
      },
      {
        id: 'dialogue-practice',
        title: 'Практика диалогов с клиентами',
        subtitle: 'Тренажёр текстовой поддержки по стандартам банка',
        avatarId: 'Avatar-3.svg',
        path: '/trainer',
        testId: 'trainer-entry',
      },
      {
        id: 'dialogue-quality',
        title: 'Качество диалогов',
        subtitle: 'Посмотреть разборы и анализы диалогов',
        avatarId: 'Avatar-4.svg',
      },
      {
        id: 'history',
        title: 'История сессий',
        subtitle: 'Прошлые результаты и транскрипции диалогов',
        avatarId: 'Avatar-4.svg',
        path: '/history',
        testId: 'history-entry',
      },
      {
        id: 'role-showcase',
        title: 'Витрина ролей',
        subtitle: 'Вакансии круга Общение с клиентом',
        avatarId: 'Avatar-5.svg',
      },
    ],
  },
  {
    title: 'Эффективность',
    cards: [
      {
        id: 'submit-skill',
        title: 'Сдать скилл',
        subtitle: 'Оставить заявку на сдачу',
        avatarId: 'Avatar-6.svg',
      },
      {
        id: 'feedback',
        title: 'Обратная связь',
        subtitle: 'Посмотреть и оставить обратную связь',
        avatarId: 'Avatar-7.svg',
      },
      {
        id: 'my-effectiveness',
        title: 'Моя эффективность',
        subtitle: 'Посмотреть результаты',
        avatarId: 'Avatar-8.svg',
      },
      {
        id: 'my-team',
        title: 'Моя команда',
        subtitle: 'Посмотреть результаты сотрудников',
        avatarId: 'Avatar-9.svg',
      },
      {
        id: 'my-grade',
        title: 'Мой грейд',
        subtitle: 'Посмотреть грейд и точки роста',
        avatarId: 'Avatar.svg',
      },
    ],
  },
];
