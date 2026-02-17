/**
 * Results types for the analysis page.
 * Block scores represent per-block analysis (0–100).
 */

export interface BlockScores {
  /** База знаний (0–100) */
  block1: number;
  /** Общий тон ответов и соответствие Tone of Voice (0–100) */
  block2: number;
  /** Соблюдение орфографических норм (0–100) */
  block3: number;
}

/**
 * Derives placeholder block scores from overall score.
 * Replace with API-based analysis when backend is available.
 */
export function deriveBlockScores(overallScore: number): BlockScores {
  return {
    block1: Math.max(0, Math.min(100, overallScore - 3)),
    block2: Math.max(0, Math.min(100, overallScore + 2)),
    block3: Math.max(0, Math.min(100, overallScore - 2)),
  };
}

// --- 1–5 point scale (new model) ---

export type BlockPoint = 1 | 2 | 3 | 4 | 5;

export interface ResultBlock {
  score: BlockPoint;
  description: string;
}

export interface AnalysisResult {
  summary: string;
  block1: ResultBlock;
  block2: ResultBlock;
  block3: ResultBlock;
}

const BLOCK1_DESCRIPTIONS: Record<BlockPoint, string> = {
  1: 'Существенные пробелы в базе знаний: неверные или устаревшие сведения, отсутствие ключевых фактов.',
  2: 'Частичное владение темой: основные моменты известны, но есть неточности и пробелы.',
  3: 'Достаточный уровень: материал в целом усвоен, отдельные неточности допустимы.',
  4: 'Хорошее владение темой: точные ответы, использование актуальной информации.',
  5: 'Отличное владение темой: полное соответствие стандартам, глубокая ориентация в материале.',
};

const BLOCK2_DESCRIPTIONS: Record<BlockPoint, string> = {
  1: 'Тон резкий, формальный или несоответствующий: ответы не соответствуют tone of voice банка.',
  2: 'Тон местами неуместен: есть отклонения от стиля общения.',
  3: 'Приемлемый тон: в целом соответствует, но возможны нюансы.',
  4: 'Хорошее соответствие tone of voice: доброжелательный, понятный стиль.',
  5: 'Отличное соответствие tone of voice: идеальное соблюдение всех правил общения.',
};

const BLOCK3_DESCRIPTIONS: Record<BlockPoint, string> = {
  1: 'Множественные орфографические и пунктуационные ошибки, не соблюдены базовые нормы.',
  2: 'Частые ошибки: пунктуация, кавычки, числа — требуют значительной доработки.',
  3: 'Допустимый уровень: единичные ошибки, основные нормы соблюдены.',
  4: 'Хорошее соблюдение норм: редкие недочёты.',
  5: 'Безупречное соблюдение орфографических и пунктуационных норм.',
};

function overallToBlockPoint(overall: number): BlockPoint {
  const p = Math.max(0, Math.min(100, overall));
  if (p < 20) return 1;
  if (p < 40) return 2;
  if (p < 60) return 3;
  if (p < 80) return 4;
  return 5;
}

/**
 * Derives stub analysis result from overall score.
 * Replace with API-based analysis when backend is available.
 */
export function deriveAnalysisResult(overallScore: number): AnalysisResult {
  const b1 = overallToBlockPoint(overallScore - 3);
  const b2 = overallToBlockPoint(overallScore + 2);
  const b3 = overallToBlockPoint(overallScore - 2);
  const avg = Math.round((b1 + b2 + b3) / 3);

  const summary =
    avg >= 4
      ? 'Вы успешно прошли тему: уверенное владение материалом и соответствие стандартам банка.'
      : avg >= 3
        ? 'Тема пройдена с замечаниями. Рекомендуется обратить внимание на указанные критерии.'
        : 'Тема требует доработки. Изучите рекомендации по каждому блоку и повторите практику.';

  return {
    summary,
    block1: { score: b1, description: BLOCK1_DESCRIPTIONS[b1] },
    block2: { score: b2, description: BLOCK2_DESCRIPTIONS[b2] },
    block3: { score: b3, description: BLOCK3_DESCRIPTIONS[b3] },
  };
}
