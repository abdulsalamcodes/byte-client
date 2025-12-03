import { tryParseQuestions } from "@/src/utils/parser";
import type { QuizQuestion } from "@/src/types/quiz";

const sample: QuizQuestion[] = [
  {
    question: "What is 2+2?",
    options: ["3", "4", "5"],
    answer: "4",
  },
];

describe("tryParseQuestions", () => {
  test("parses valid JSON array", () => {
    const result = tryParseQuestions(JSON.stringify(sample));
    expect(result).not.toBeNull();
    expect(result!.length).toBe(1);
    expect(result![0].answer).toBe("4");
  });

  test("extracts array from raw text", () => {
    const raw = `Some preface...\n\n${JSON.stringify(
      sample
    )}\n\nTrailing notes.`;
    const result = tryParseQuestions(raw);
    expect(result).not.toBeNull();
    expect(result![0].question).toContain("2+2");
  });

  test("returns null for invalid content", () => {
    expect(tryParseQuestions("not json")).toBeNull();
  });
});
