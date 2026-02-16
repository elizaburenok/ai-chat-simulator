/**
 * Training topics for the chat simulator.
 * Each topic has id, Russian name, short description, and progress (sessions %, attempts).
 */

export interface TopicProgress {
  sessionsPercent: number;
  attemptsCount: number;
}

export interface Topic {
  id: string;
  nameRu: string;
  descriptionShort: string;
  progress: TopicProgress;
}

export const topicsData: Topic[] = [
  { id: 'fund-return', nameRu: 'Возврат средств', descriptionShort: 'Оформление и сроки возврата средств по операциям.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'card-block', nameRu: 'Блокировка карты', descriptionShort: 'Временная и постоянная блокировка карты по запросу клиента.', progress: { sessionsPercent: 30, attemptsCount: 3 } },
  { id: 'credit-limit', nameRu: 'Кредитный лимит', descriptionShort: 'Изменение лимита, условия и документы.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'pin-change', nameRu: 'Смена ПИН-кода', descriptionShort: 'Способы смены ПИН-кода в приложении и банкомате.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'transfers', nameRu: 'Переводы', descriptionShort: 'Переводы между счетами, другим клиентам, в другие банки.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'debit-cards', nameRu: 'Дебетовые карты', descriptionShort: 'Выпуск, доставка и обслуживание дебетовых карт.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'loans', nameRu: 'Кредиты', descriptionShort: 'Оформление кредита, погашение, досрочное погашение.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'investments', nameRu: 'Инвестиции', descriptionShort: 'Инвестиционные продукты и открытие счёта.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'insurance', nameRu: 'Страхование', descriptionShort: 'Подключение и условия страховых программ.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'mobile-banking', nameRu: 'Мобильный банк', descriptionShort: 'Вход, восстановление доступа, настройки приложения.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'disputed-transactions', nameRu: 'Оспаривание операций', descriptionShort: 'Порядок оспаривания и расследования операций.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'limits', nameRu: 'Лимиты', descriptionShort: 'Лимиты на операции и их изменение.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'operation-confirmation', nameRu: 'Подтверждение операции', descriptionShort: 'Способы подтверждения платежей и переводов.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'bonuses', nameRu: 'Бонусы', descriptionShort: 'Накопление и списание бонусов, программа лояльности.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
  { id: 'account-closure', nameRu: 'Закрытие счёта', descriptionShort: 'Условия и порядок закрытия счёта и карты.', progress: { sessionsPercent: 0, attemptsCount: 0 } },
];

export function getTopicById(id: string): Topic | undefined {
  return topicsData.find((t) => t.id === id);
}
