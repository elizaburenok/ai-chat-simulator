/**
 * Training topics for the chat simulator.
 * Each topic has id, Russian name, short description, progress, and optional relevance for role/grade.
 */

export interface TopicProgress {
  sessionsPercent: number;
  attemptsCount: number;
  /** Average score 0–10 for face icon. If undefined, no attempts yet (show Happy). */
  averageScore?: number;
}

/** Role and grade IDs that this topic is recommended for. Empty = relevant for all. */
export interface TopicRelevance {
  roleIds?: string[];
  gradeIds?: string[];
}

export interface Topic {
  id: string;
  nameRu: string;
  descriptionShort: string;
  progress: TopicProgress;
  /** When set, topic is recommended for users whose role and grade match. */
  relevance?: TopicRelevance;
}

/** User context for recommendation. In real app would come from auth/profile. */
export interface UserTopicContext {
  roleId: string;
  gradeId: string;
}

export const topicsData: Topic[] = [
  { id: 'fund-return', nameRu: 'Возврат средств', descriptionShort: 'Оформление и сроки возврата средств по операциям.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['support', 'back-office'], gradeIds: ['junior', 'middle'] } },
  { id: 'card-block', nameRu: 'Блокировка карты', descriptionShort: 'Временная и постоянная блокировка карты по запросу клиента.', progress: { sessionsPercent: 30, attemptsCount: 3, averageScore: 7.2 }, relevance: { roleIds: ['support'], gradeIds: ['junior', 'middle', 'senior'] } },
  { id: 'credit-limit', nameRu: 'Кредитный лимит', descriptionShort: 'Изменение лимита, условия и документы.', progress: { sessionsPercent: 55, attemptsCount: 5, averageScore: 9 }, relevance: { roleIds: ['sales', 'support'], gradeIds: ['middle', 'senior'] } },
  { id: 'pin-change', nameRu: 'Смена ПИН-кода', descriptionShort: 'Способы смены ПИН-кода в приложении и банкомате.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['support'], gradeIds: ['junior'] } },
  { id: 'transfers', nameRu: 'Переводы', descriptionShort: 'Переводы между счетами, другим клиентам, в другие банки.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['support', 'back-office'], gradeIds: ['junior', 'middle'] } },
  { id: 'debit-cards', nameRu: 'Дебетовые карты', descriptionShort: 'Выпуск, доставка и обслуживание дебетовых карт.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['sales', 'support'], gradeIds: ['junior', 'middle'] } },
  { id: 'loans', nameRu: 'Кредиты', descriptionShort: 'Оформление кредита, погашение, досрочное погашение.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['sales'], gradeIds: ['middle', 'senior'] } },
  { id: 'investments', nameRu: 'Инвестиции', descriptionShort: 'Инвестиционные продукты и открытие счёта.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['sales'], gradeIds: ['senior'] } },
  { id: 'insurance', nameRu: 'Страхование', descriptionShort: 'Подключение и условия страховых программ.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['sales', 'support'], gradeIds: ['middle'] } },
  { id: 'mobile-banking', nameRu: 'Мобильный банк', descriptionShort: 'Вход, восстановление доступа, настройки приложения.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['support'], gradeIds: ['junior', 'middle'] } },
  { id: 'disputed-transactions', nameRu: 'Оспаривание операций', descriptionShort: 'Порядок оспаривания и расследования операций.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['support', 'back-office'], gradeIds: ['middle', 'senior'] } },
  { id: 'limits', nameRu: 'Лимиты', descriptionShort: 'Лимиты на операции и их изменение.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['support'], gradeIds: ['junior', 'middle'] } },
  { id: 'operation-confirmation', nameRu: 'Подтверждение операции', descriptionShort: 'Способы подтверждения платежей и переводов.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['support'], gradeIds: ['junior'] } },
  { id: 'bonuses', nameRu: 'Бонусы', descriptionShort: 'Накопление и списание бонусов, программа лояльности.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['sales', 'support'], gradeIds: ['middle'] } },
  { id: 'account-closure', nameRu: 'Закрытие счёта', descriptionShort: 'Условия и порядок закрытия счёта и карты.', progress: { sessionsPercent: 0, attemptsCount: 0 }, relevance: { roleIds: ['support', 'back-office'], gradeIds: ['middle', 'senior'] } },
];

export function getTopicById(id: string): Topic | undefined {
  return topicsData.find((t) => t.id === id);
}

/**
 * Returns 1–4 topics most relevant for the user's role and grade.
 * Topics with matching relevance are returned first, up to 4.
 */
export function getRecommendedTopics(user: UserTopicContext): Topic[] {
  const match = (topic: Topic): boolean => {
    const r = topic.relevance;
    if (!r) return false;
    const roleMatch = !r.roleIds?.length || r.roleIds.includes(user.roleId);
    const gradeMatch = !r.gradeIds?.length || r.gradeIds.includes(user.gradeId);
    return roleMatch && gradeMatch;
  };
  return topicsData.filter(match).slice(0, 4);
}
