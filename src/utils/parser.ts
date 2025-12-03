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
  } catch (e) {
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
    } catch (e) {
      // ignore
    }
  }

  return null;
}

function normalizeQuestions(arr: unknown[]): QuizQuestion[] {
  return arr
    .map((q: unknown) => {
      const obj = q as {
        question?: unknown;
        options?: unknown;
        answer?: unknown;
      };
      const options = Array.isArray(obj?.options)
        ? obj.options.map(String)
        : [];
      return {
        question: String(obj?.question ?? ""),
        options,
        answer: String(obj?.answer ?? ""),
      } as QuizQuestion;
    })
    .filter((q) => q.question && q.options.length > 0 && q.answer);
}
