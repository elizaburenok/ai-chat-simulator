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
