import { Difficulty, ExamResponse, MathProblem } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("Missing NEXT_PUBLIC_API_URL environment variable");
}

async function fetchJson<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const apiClient = {
  getTopicProblem: (topic: string, difficulty: Difficulty = "medium") => {
    return fetchJson<MathProblem>(
      `/generator/${topic}?difficulty=${difficulty}`,
    );
  },

  getRandomProblem: (difficulty: Difficulty = "medium") => {
    return fetchJson<MathProblem>(`/generator/random?difficulty=${difficulty}`);
  },

  getExam: (difficulty: Difficulty = "medium") => {
    return fetchJson<ExamResponse>(`/exam/full?difficulty=${difficulty}`);
  },
};
