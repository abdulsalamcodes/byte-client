/*
  Parsing helper to convert raw text into quiz questions.
  Strategy:
  1) Try JSON.parse directly.
  2) If it fails, attempt to extract the first [...] array via regex and parse that.
*/
import { QuizQuestion } from "@/src/types/quiz";

export function tryParseQuestions(raw: string): QuizQuestion[] | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  // First, try direct JSON
  try {
    const data = JSON.parse(trimmed);
    if (Array.isArray(data)) {
      return normalizeQuestions(data as unknown[]);
    }
  } catch {
    // fallthrough
  }

  // Try to extract an array using a regex that finds the first balanced [] block
  const match = trimmed.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const data = JSON.parse(match[0]);
      if (Array.isArray(data)) {
        return normalizeQuestions(data as unknown[]);
      }
    } catch {
      // ignore
    }
  }

  return null;
}

function extractFencedCode(question: string, code?: string) {
  const match = question.match(/\s*```[\w-]*\n?([\s\S]*?)```\s*/);
  if (!match) {
    return { question: question.trim(), code: code?.trim() || undefined };
  }

  return {
    question: question.replace(match[0], ' ').replace(/\s+/g, ' ').trim(),
    code: code?.trim() || match[1].trim(),
  };
}

function normalizeQuestions(arr: unknown[]): QuizQuestion[] {
  return arr
    .map((q: unknown) => {
      const obj = q as {
        question?: unknown;
        options?: unknown;
        answer?: unknown;
        kind?: unknown;
        lab_format?: unknown;
        scenario?: unknown;
        code?: unknown;
        logs?: unknown;
        diff?: unknown;
        constraints?: unknown;
        tradeoffs?: unknown;
        concept?: unknown;
        explanation?: unknown;
        source?: unknown;
        verified?: unknown;
        verification_reason?: unknown;
      };
      const options = Array.isArray(obj?.options)
        ? obj.options.map(String)
        : [];
      const normalized = extractFencedCode(
        String(obj?.question ?? ""),
        typeof obj?.code === 'string' ? obj.code : undefined
      );
      return {
        question: normalized.question,
        options,
        answer: String(obj?.answer ?? ""),
        kind: obj?.kind === 'code-review' || normalized.code ? 'code-review' : 'multiple-choice',
        lab_format:
          typeof obj?.lab_format === 'string'
            ? (obj.lab_format as QuizQuestion['lab_format'])
            : undefined,
        scenario: typeof obj?.scenario === 'string' ? obj.scenario : null,
        code: normalized.code,
        logs: typeof obj?.logs === 'string' ? obj.logs : null,
        diff: typeof obj?.diff === 'string' ? obj.diff : null,
        constraints: Array.isArray(obj?.constraints)
          ? obj.constraints.map(String)
          : [],
        tradeoffs: Array.isArray(obj?.tradeoffs)
          ? obj.tradeoffs.map(String)
          : [],
        concept: typeof obj?.concept === 'string' ? obj.concept : undefined,
        explanation:
          typeof obj?.explanation === 'string' ? obj.explanation : undefined,
        source: typeof obj?.source === 'string' ? obj.source : undefined,
        verified: obj?.verified === true,
        verification_reason:
          typeof obj?.verification_reason === 'string'
            ? obj.verification_reason
            : null,
      } as QuizQuestion;
    })
    .filter((q) => q.question && q.options.length > 0 && q.answer);
}
