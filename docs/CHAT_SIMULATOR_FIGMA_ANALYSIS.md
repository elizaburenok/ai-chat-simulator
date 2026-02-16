# Chat Simulator: Figma vs Current Implementation

## Design reference
- **Figma:** [AI Тренажёр](https://www.figma.com/design/p5JeEtGLuzqvDtE5d8HCoo) — node `4:2902`
- **Scope:** Chat screen (AI-Ассистент conversation + input)

---

## 1. How the design differs from the current version

### 1.1 Page / Chrome
| Aspect | Figma | Current |
|--------|--------|--------|
| **Header** | Full bank header: logo «точка банк», LIVE badge, nav (Главная, Платежи, Сервисы), centered purple AI icon, user block (avatar «НО», name, ИНН, icons) | No app header; sidebar «Сессии» + main area with text links |
| **Chat screen header** | Back arrow (←) + large title «AI-Ассистент» | «← К выбору темы» and «Пауза» as text links above dialogue |

### 1.2 Intro block
| Aspect | Figma | Current |
|--------|--------|--------|
| **Above messages** | Date separator only, e.g. «Вчера» (centered, light gray) | Intro block: avatar + «Клиент» + scenario text («Клиент пишет по теме: …») |

### 1.3 Messages
| Aspect | Figma | Current |
|--------|--------|--------|
| **User message** | Right-aligned; light purple bubble; no avatar in row | Treated as «client»: left-aligned, avatar shown, neutral-2 background |
| **AI message** | Left-aligned; purple circle avatar with «А»; label «AI-Ассистент»; white bubble with shadow; lists/formatting; «Источники» link; feedback row (bookmark, star, thumbs up/down) | Treated as «specialist»: right-aligned, brand purple bubble, meta «Вы» + time |
| **Bubble styling** | User: light purple. AI: white + drop shadow (Surfaces/Card) | Client: `--color-bg-neutral-2`. Specialist: `--color-bg-brand` |
| **Sender label** | «AI-Ассистент» above AI bubble | «Клиент» / «Вы» in meta under bubble |

### 1.4 Input area
| Aspect | Figma | Current |
|--------|--------|--------|
| **Control** | Single pill-shaped field, rounded, light gray feel; send = arrow-up icon in circle (no text) | Plain input + separate primary «Отправить» button |
| **Placeholder** | «Спросите у AI-Ассистента» | «Введите сообщение...» |
| **FAB** | Dark circular button with speech-bubble icon, bottom-right | None |

### 1.5 Other
| Aspect | Figma | Current |
|--------|--------|--------|
| **Finish / Pause** | Not shown in frame | «Завершить» button; pause overlay with «Продолжить» / «Завершить сейчас» |

---

## 2. Modification blocks (prioritised)

1. **Block A — Chat header**  
   Add a clear chat header: back arrow + title «AI-Ассистент» (no full bank header in this pass).

2. **Block B — Intro and date**  
   Remove or minimise the «Клиент» + scenario intro; add a date separator (e.g. «Вчера» / «Сегодня») above the first messages.

3. **Block C — Message layout and styling**  
   - User (client): right-aligned, light purple bubble (`--color-bg-brand-1` / `-2`), no avatar in message row.  
   - AI (specialist): left-aligned, avatar (purple circle + «А»), label «AI-Ассистент», white bubble + card shadow; keep meta optional/small.

4. **Block D — Input**  
   Use existing `InputMessage` in `DialogueContent`; placeholder «Спросите у AI-Ассистента»; send = icon only (no «Отправить» text). FAB optional later.

5. **Block E — AI message footer**  
   Under AI messages: optional «Источники» link + feedback icons (bookmark, star, thumbs up, thumbs down) using tokens/icons.

6. **Block F (optional)**  
   Full bank header and FAB can be added in a follow-up if needed.

---

## 3. Tokens / variables (from Figma node)

- **Surfaces/Card:** `DROP_SHADOW` (0, 5), radius 15, `#0000000D`  
- **Rounding 6x:** 24px (pill)  
- **Bg/Brand 1:** `#efedf8` (light purple for user bubble)  
- **TTN 600/2XL:** 24px DemiBold for title  
- **Spacing:** 20, 32, 10, 6, 16 (5x, 8x, 2.5x, 1.5x, 4x)

Existing `tokens/css-variables.css` already has `--color-bg-brand-1`, `--rounding-6x`, etc. Add card shadow variable if missing.
