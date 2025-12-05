"use client";

import { useState, useEffect } from "react";
import { useExam } from "@/hooks/useMathApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskCard } from "@/components/math/TaskCard";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty } from "@/types/api";

const EXAM_TIME_SECONDS = 170 * 60;

export default function ExamPage() {
  const [status, setStatus] = useState<"intro" | "active" | "finished">("intro");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const { data: exam, isLoading } = useExam(difficulty);

  useEffect(() => {
    if (status !== "active") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const calculateScore = () => {
    if (!exam) return 0;
    let score = 0;
    exam.tasks.forEach((task, idx) => {
      if (answers[idx] === task.answers.correct) score++;
    });
    return Math.round((score / exam.tasks.length) * 100);
  };

  if (status === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-xl w-full p-8 text-center space-y-6">
          <h1 className="text-3xl font-bold text-slate-900">Symulator Matury</h1>
          <p className="text-slate-600">
            Wygenerujemy dla Ciebie pełny arkusz (ok. 30 zadań). Masz 170 minut.
            Po zakończeniu otrzymasz szczegółowy raport.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => setStatus("active")} disabled={isLoading}>
              {isLoading ? "Generowanie arkusza..." : "Rozpocznij Egzamin"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (status === "finished" && exam) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8 text-center bg-white">
            <h2 className="text-2xl font-bold mb-2">Egzamin Zakończony</h2>
            <div className="text-6xl font-black text-indigo-600 mb-4">{score}%</div>
            <p className="text-slate-500">Twój wynik z próbnym arkuszem.</p>
            <Button onClick={() => window.location.reload()} className="mt-6">Spróbuj ponownie</Button>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-bold ml-1">Szczegółowe rozwiązania:</h3>
            {exam.tasks.map((task, idx) => {
              const isCorrect = answers[idx] === task.answers.correct;
              return (
                <div key={idx} className={cn("border rounded-lg overflow-hidden", isCorrect ? "border-green-200" : "border-red-200")}>
                  <div className={cn("p-2 px-4 text-sm font-bold flex justify-between", isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                    <span>Zadanie {idx + 1}</span>
                    <span>{isCorrect ? "Dobrze" : "Źle"}</span>
                  </div>
                  <TaskCard
                    problem={task}
                    mode="exam_review"
                    externalAnswer={answers[idx]}
                    showNextButton={false}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  const currentTask = exam.tasks[currentTaskIndex];
  const progress = ((currentTaskIndex + 1) / exam.tasks.length) * 100;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-bold text-xl text-slate-800">Maturator</span>
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-mono">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setStatus("finished")}>
            Zakończ egzamin
          </Button>
        </div>
        <Progress value={progress} className="h-1 mt-4 w-full absolute bottom-0 left-0 rounded-none" />
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

        <div className="order-2 lg:order-1">
          <div className="mb-4 text-slate-500 font-medium">Zadanie {currentTaskIndex + 1} z {exam.tasks.length}</div>
          <TaskCard
            problem={currentTask}
            mode="exam_active"
            externalAnswer={answers[currentTaskIndex]}
            onAnswerChange={(val) => setAnswers(prev => ({ ...prev, [currentTaskIndex]: val }))}
            showNextButton={false}
          />

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentTaskIndex(i => Math.max(0, i - 1))}
              disabled={currentTaskIndex === 0}
            >
              Poprzednie
            </Button>
            <Button
              onClick={() => setCurrentTaskIndex(i => Math.min(exam.tasks.length - 1, i + 1))}
              disabled={currentTaskIndex === exam.tasks.length - 1}
            >
              Następne
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2 bg-white rounded-xl border p-4 shadow-sm">
          <h3 className="font-bold mb-4 text-slate-700">Mapa zadań</h3>
          <div className="grid grid-cols-5 gap-2">
            {exam.tasks.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isCurrent = currentTaskIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentTaskIndex(idx)}
                  className={cn(
                    "w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-all",
                    isCurrent ? "bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-600" :
                      isAnswered ? "bg-indigo-100 text-indigo-700 border border-indigo-200" :
                        "bg-slate-50 text-slate-500 hover:bg-slate-100 border"
                  )}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800 flex gap-2 items-start">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Pamiętaj, aby zatwierdzić egzamin przed upływem czasu!</span>
          </div>
        </div>

      </div>
    </main>
  );
}
