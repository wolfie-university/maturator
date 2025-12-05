"use client";

import { useState, useMemo, useEffect } from "react";
import { MathProblem } from "@/types/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ChevronRight, HelpCircle } from "lucide-react";
import { MathRenderer } from "./MathRenderer";
import { shuffleArray, cn } from "@/lib/utils";

interface TaskCardProps {
  problem: MathProblem;
  onNext?: () => void;
  showNextButton?: boolean;
  mode?: "training" | "exam_active" | "exam_review";
  externalAnswer?: string | null;
  onAnswerChange?: (answer: string) => void;
}

export const TaskCard = ({
  problem,
  onNext,
  showNextButton = true,
  mode = "training",
  externalAnswer,
  onAnswerChange
}: TaskCardProps) => {
  const [localAnswer, setLocalAnswer] = useState<string | null>(null);
  const [localInput, setLocalInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSolutionVisible, setIsSolutionVisible] = useState(false);

  useEffect(() => {
    if (mode === "training") {
      setLocalAnswer(null);
      setLocalInput("");
      setIsSubmitted(false);
      setIsSolutionVisible(false);
    }
  }, [problem, mode]);

  const currentAnswer = mode === "training"
    ? (problem.answers.type === 'closed' ? localAnswer : localInput)
    : externalAnswer || "";

  const shuffledAnswers = useMemo(() => {
    if (problem.answers.type === "closed" && problem.answers.distractors) {
      const all = [problem.answers.correct, ...problem.answers.distractors];
      return shuffleArray(all);
    }
    return [];
  }, [problem]);

  const isCorrect = useMemo(() => {
    if (mode === "training" && !isSubmitted) return false;

    const ans = currentAnswer?.trim();
    const correct = problem.answers.correct.trim();
    return ans === correct;
  }, [mode, isSubmitted, currentAnswer, problem]);

  const handleSelect = (val: string) => {
    if (mode === "exam_review" || (mode === "training" && isSubmitted)) return;

    if (mode === "training") {
      if (problem.answers.type === 'closed') setLocalAnswer(val);
      else setLocalInput(val);
    } else {
      onAnswerChange?.(val);
    }
  };

  const handleSubmit = () => {
    if ((problem.answers.type === "closed" && !localAnswer) ||
      (problem.answers.type === "open" && !localInput)) return;

    setIsSubmitted(true);
    setIsSolutionVisible(true);
  };

  const showSolution = mode === "exam_review" || (mode === "training" && isSolutionVisible);
  const showFeedback = mode === "exam_review" || (mode === "training" && isSubmitted);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-slate-50/50 border-b pb-4">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-slate-500">
            {problem.meta.type.replace("Generator", "")}
          </Badge>
          <Badge
            variant={problem.meta.difficulty === 'easy' ? 'secondary' : problem.meta.difficulty === 'hard' ? 'destructive' : 'default'}
            className="capitalize"
          >
            {problem.meta.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl font-medium leading-relaxed text-slate-800">
          <MathRenderer text={problem.content.question_text} />
        </CardTitle>

        {problem.content.question_latex && (
          <div className="mt-4 p-4 bg-slate-100 rounded-lg text-center overflow-x-auto">
            <MathRenderer text={`$$${problem.content.question_latex}$$`} block />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {problem.content.image_svg && (
          <div
            className="flex justify-center p-4 bg-white border rounded-xl overflow-hidden [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[300px]"
            dangerouslySetInnerHTML={{ __html: problem.content.image_svg }}
          />
        )}

        <div className="space-y-4">
          {problem.answers.type === "closed" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {shuffledAnswers.map((ans, idx) => {
                const isThisSelected = currentAnswer === ans;
                const isThisCorrect = ans === problem.answers.correct;

                let variantClass = "hover:bg-slate-100 border-slate-200";

                if (mode === "exam_review" || (mode === "training" && isSubmitted)) {
                  if (isThisCorrect) {
                    variantClass = "bg-green-100 border-green-500 text-green-800 hover:bg-green-100";
                  } else if (isThisSelected && !isThisCorrect) {
                    variantClass = "bg-red-100 border-red-500 text-red-800 hover:bg-red-100";
                  } else {
                    variantClass = "opacity-50";
                  }
                } else if (isThisSelected) {
                  variantClass = "bg-slate-900 text-white hover:bg-slate-800 border-slate-900";
                }

                return (
                  <Button
                    key={idx}
                    variant="outline"
                    className={cn("h-auto py-4 px-6 justify-start text-left text-base font-normal whitespace-normal transition-all", variantClass)}
                    onClick={() => handleSelect(ans)}
                    disabled={mode === "exam_review" || (mode === "training" && isSubmitted)}
                  >
                    <span className="font-bold mr-3 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
                    <MathRenderer text={`$$${ans}$$`} />
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Wpisz wynik..."
                  value={currentAnswer || ""}
                  onChange={(e) => handleSelect(e.target.value)}
                  disabled={mode === "exam_review" || (mode === "training" && isSubmitted)}
                  className={cn("text-lg", showFeedback && (isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"))}
                />
                {showFeedback && (
                  <div className="flex items-center whitespace-nowrap text-sm text-slate-500">
                    Poprawna: <span className="font-bold ml-1"><MathRenderer text={`$$${problem.answers.correct}$$`} /></span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showFeedback && (
          <div className={cn("flex items-center gap-2 p-4 rounded-lg animate-in fade-in zoom-in-95", isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
            {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            <span className="font-medium text-lg">
              {isCorrect ? "Świetnie! Dobra odpowiedź." : "Niestety, to nie jest poprawna odpowiedź."}
            </span>
          </div>
        )}

        {showSolution && (
          <div className="mt-6 border-t pt-6 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-4 text-slate-800">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-lg">Rozwiązanie krok po kroku</h3>
            </div>
            <div className="space-y-3">
              {problem.solution.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 text-slate-600 bg-slate-50 p-3 rounded-md">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="text-base leading-relaxed">
                    <MathRenderer text={step} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-3 bg-slate-50/50 border-t p-4">
        {mode === "training" && !isSubmitted ? (
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!currentAnswer}
            className="w-full md:w-auto"
          >
            Sprawdź odpowiedź
          </Button>
        ) : (
          showNextButton && onNext && (
            <Button size="lg" onClick={onNext} className="w-full md:w-auto gap-2">
              Następne zadanie <ChevronRight className="w-4 h-4" />
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};
