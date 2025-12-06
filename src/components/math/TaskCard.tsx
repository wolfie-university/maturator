"use client";

import { useState, useMemo, useEffect } from "react";
import { MathProblem } from "@/types/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ChevronRight, HelpCircle, Lightbulb } from "lucide-react";
import { MathRenderer } from "./MathRenderer";
import { MathInput } from "./MathInput";
import { cn } from "@/lib/utils";
import { parseToLatex } from "@/lib/mathParser";

interface TaskCardProps {
  problem: MathProblem;
  onNext?: () => void;
  showNextButton?: boolean;
  mode?: "training" | "exam_active" | "exam_review";
  externalAnswer?: string | null;
  onAnswerChange?: (answer: string) => void;
}

const pseudoShuffle = (array: string[], seedStr: string) => {
  let seed = seedStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rng = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const TaskCard = ({
  problem,
  onNext,
  showNextButton = true,
  mode = "training",
  externalAnswer,
  onAnswerChange
}: TaskCardProps) => {
  const questionType = problem.question_type || problem.answers.type;

  const [localAnswer, setLocalAnswer] = useState<string | null>(null);
  const [localInput, setLocalInput] = useState("");
  const [localInputLatex, setLocalInputLatex] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSolutionVisible, setIsSolutionVisible] = useState(false);

  useEffect(() => {
    if (mode === "training") {
      setLocalAnswer(null);
      setLocalInput("");
      setLocalInputLatex("");
      setIsSubmitted(false);
      setIsSolutionVisible(false);
    }
  }, [problem, mode]);

  useEffect(() => {
    if (mode !== "training" && externalAnswer) {
      if (questionType === "open") {
        setLocalInput(externalAnswer);
        setLocalInputLatex(parseToLatex(externalAnswer));
      } else {
        setLocalAnswer(externalAnswer);
      }
    } else if (mode !== "training" && !externalAnswer) {
      setLocalInput("");
      setLocalInputLatex("");
      setLocalAnswer(null);
    }
  }, [externalAnswer, mode, problem, questionType]);

  const currentAnswerRaw = mode === "training"
    ? (questionType === 'closed' ? localAnswer : localInput)
    : externalAnswer || "";

  const shuffledAnswers = useMemo(() => {
    if (questionType === "closed" && problem.answers.distractors) {
      const all = [problem.answers.correct, ...problem.answers.distractors];
      return pseudoShuffle(all, problem.content.question_text);
    }
    return [];
  }, [problem, questionType]);

  const isCorrect = useMemo(() => {
    if (mode === "exam_active") return false;
    if (mode === "training" && !isSubmitted) return false;

    if (questionType === 'closed') {
      return currentAnswerRaw === problem.answers.correct;
    } else {
      const userLatex = mode === "training" ? localInputLatex : parseToLatex(currentAnswerRaw || "");
      const correctNormalized = problem.answers.correct.replace(/\s+/g, "");
      const userNormalized = userLatex.replace(/\s+/g, "");
      const rawMatch = currentAnswerRaw?.replace(/\s+/g, "") === correctNormalized;

      if (!currentAnswerRaw) return false;
      return userNormalized === correctNormalized || rawMatch;
    }
  }, [mode, isSubmitted, currentAnswerRaw, localInputLatex, problem, questionType]);

  const handleSelectClosed = (val: string) => {
    if (mode === "exam_review" || (mode === "training" && isSubmitted)) return;

    if (mode === "training") {
      setLocalAnswer(val);
    } else {
      onAnswerChange?.(val);
    }
  };

  const handleInputOpen = (rawVal: string, latexVal: string) => {
    if (mode === "exam_review" || (mode === "training" && isSubmitted)) return;

    if (mode === "training") {
      setLocalInput(rawVal);
      setLocalInputLatex(latexVal);
    } else {
      onAnswerChange?.(rawVal);
    }
  };

  const handleSubmit = () => {
    if ((questionType === "closed" && !localAnswer) ||
      (questionType === "open" && !localInput)) return;

    setIsSubmitted(true);
    setIsSolutionVisible(true);
  };

  const showSolution = mode === "exam_review" || (mode === "training" && isSolutionVisible);
  const showFeedback = mode === "exam_review" || (mode === "training" && isSubmitted);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="bg-background/50 border-y py-6">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className="text-xs uppercase tracking-wider text-foreground/40">
            {problem.meta.type.replace("Generator", "")}
          </Badge>
          <Badge
            variant={problem.meta.difficulty === 'easy' ? 'secondary' : problem.meta.difficulty === 'hard' ? 'destructive' : 'default'}
            className="capitalize"
          >
            {problem.meta.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl font-medium leading-relaxed text-foreground/80">
          <MathRenderer text={problem.content.question_text} />
        </CardTitle>

        {problem.content.question_latex && (
          <div className="rounded-lg text-center overflow-x-auto mt-2">
            <MathRenderer text={`$$${problem.content.question_latex}$$`} block />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {problem.content.image_svg && (
          <div
            className="flex justify-center border rounded-xl overflow-hidden bg-white [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[300px]"
            dangerouslySetInnerHTML={{ __html: problem.content.image_svg }}
          />
        )}

        <div className="space-y-4">
          {questionType === "closed" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {shuffledAnswers.map((ans, idx) => {
                const isThisSelected = currentAnswerRaw === ans;
                const isThisCorrect = ans === problem.answers.correct;

                let variantClass = "hover:bg-accent border-input";

                if (showFeedback) {
                  if (isThisCorrect) {
                    variantClass = "bg-green-100 border-green-500 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300";
                  } else if (isThisSelected && !isThisCorrect) {
                    variantClass = "bg-red-100 border-red-500 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300";
                  } else {
                    variantClass = "opacity-50";
                  }
                } else if (isThisSelected) {
                  variantClass = "bg-primary text-primary hover:bg-primary/90 border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900";
                }

                return (
                  <Button
                    key={idx}
                    variant="outline"
                    className={cn("h-auto py-4 px-6 justify-start text-left text-base font-normal whitespace-normal transition-all", variantClass)}
                    onClick={() => handleSelectClosed(ans)}
                    disabled={showFeedback && mode !== "exam_review"}
                  >
                    <span className={cn("font-bold mr-3", isThisSelected && !showFeedback ? "text-primary/70" : "text-muted-foreground")}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <MathRenderer text={`$$${ans}$$`} />
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="max-w-xl mx-auto">
              <MathInput
                value={currentAnswerRaw || ""}
                onChange={handleInputOpen}
                disabled={showFeedback}
                onEnter={mode === "training" ? handleSubmit : undefined}
                placeholder={showFeedback ? "" : "Wpisz swoją odpowiedź tutaj..."}
                className={
                  cn(showFeedback && (isCorrect ? "ring ring-offset-background/80 ring-green-500 ring-offset-4 rounded-lg" : "ring ring-offset-background/80 ring-red-500 ring-offset-4 rounded-lg"))
                }
              />

              {problem.answer_format && !showFeedback && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md w-fit">
                  <Lightbulb className="w-3 h-3" />
                  <span>
                    Format odpowiedzi: <MathRenderer text={`$$${problem.answer_format}$$`} className="font-mono font-medium text-foreground/80 ml-1" />
                  </span>
                </div>
              )}

              {showFeedback && (
                <div className="mt-4 p-4 rounded-md border bg-muted/20 flex flex-col items-center animate-in fade-in slide-in-from-top-2">
                  <span className="text-xs text-foreground/50 uppercase font-bold mb-1 tracking-wider">Poprawna odpowiedź:</span>
                  <div className="text-lg font-medium text-foreground">
                    <MathRenderer text={`$$${problem.answers.correct}$$`} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {showFeedback && (
          <div className={cn("flex items-center gap-3 p-4 rounded-lg animate-in fade-in zoom-in-95 shadow-sm", isCorrect ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800")}>
            {isCorrect ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
            <span className="font-medium text-md">
              {isCorrect
                ? "Świetnie! Dobra odpowiedź."
                : !currentAnswerRaw
                  ? "Nie udzielono odpowiedzi."
                  : "Niestety, to nie jest poprawna odpowiedź."}
            </span>
          </div>
        )}

        {showSolution && (
          <div className="mt-6 border-t pt-6 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-2 mb-4 text-foreground/70">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-lg text-foreground">Rozwiązanie krok po kroku</h3>
            </div>
            <div className="space-y-3">
              {problem.solution.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4 text-foreground/80 bg-muted/30 p-4 rounded-lg border border-transparent hover:border-border transition-colors">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="text-base leading-relaxed overflow-x-auto">
                    <MathRenderer text={step} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end border-t pt-6 pb-6">
        {mode === "training" && !isSubmitted ? (
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!currentAnswerRaw}
            className="w-full md:w-auto shadow-md"
          >
            Sprawdź odpowiedź
          </Button>
        ) : (
          showNextButton && onNext && (
            <Button size="lg" onClick={onNext} className="w-full md:w-auto gap-2 shadow-md">
              Następne zadanie <ChevronRight className="w-4 h-4" />
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};
