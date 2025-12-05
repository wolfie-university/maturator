import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Difficulty } from "@/types/api";

export const queryKeys = {
  problem: (topic: string, diff: string) => ["problem", topic, diff],
  random: (diff: string) => ["random", diff],
  exam: (diff: string) => ["exam", diff],
};

export const useTopicProblem = (topic: string, difficulty: Difficulty) => {
  return useQuery({
    queryKey: queryKeys.problem(topic, difficulty),
    queryFn: () => apiClient.getTopicProblem(topic, difficulty),
    enabled: !!topic,
  });
};

export const useRandomProblem = (difficulty: Difficulty) => {
  return useQuery({
    queryKey: queryKeys.random(difficulty),
    queryFn: () => apiClient.getRandomProblem(difficulty),
  });
};

export const useExam = (difficulty: Difficulty) => {
  return useQuery({
    queryKey: queryKeys.exam(difficulty),
    queryFn: () => apiClient.getExam(difficulty),
    staleTime: Infinity,
  });
};
