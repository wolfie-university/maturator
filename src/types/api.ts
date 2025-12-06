export type Difficulty = "easy" | "medium" | "hard";

export interface ProblemMeta {
  type: string;
  difficulty: Difficulty;
}

export interface ProblemContent {
  question_text: string;
  question_latex: string; // f(x) = 2x^2
  image_svg: string | null;
  variables: Record<string, number | string>;
}

export type AnswerType = "closed" | "open";

export interface ProblemAnswers {
  type: AnswerType;
  correct: string;
  distractors?: string[];
}

export interface ProblemSolution {
  steps: string[];
}

export interface MathProblem {
  taskNumber?: number;
  meta: ProblemMeta;
  content: ProblemContent;
  answers: ProblemAnswers;
  solution: ProblemSolution;
  question_type: "closed" | "open";
  answer_format: string;
}

export interface ExamResponse {
  title: string;
  generatedAt: string;
  tasksCount: number;
  tasks: MathProblem[];
}
