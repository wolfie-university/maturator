"use client";

import { useState, useEffect } from "react";
import { useExam } from "@/hooks/useMathApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TaskCard } from "@/components/math/TaskCard";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty } from "@/types/api";
import { ExamCanvasCard } from "@/components/exam/ExamCanvasCard";

const EXAM_TIME_SECONDS = 180 * 60;

type ExamStatus = "intro" | "cover" | "instruction" | "active" | "finished";

export default function ExamPage() {
  const [status, setStatus] = useState<ExamStatus>("intro");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
  const [difficulty] = useState<Difficulty>("medium");

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

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
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

  const drawCoverOverlay = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const now = new Date();

    const dayName = now.toLocaleDateString("pl-PL", { weekday: "long" });
    const dayLetter = dayName.charAt(0).toUpperCase();
    const dayNum = String(now.getDate()).padStart(2, "0");
    const code = `${dayLetter}${dayNum}`; // S08 (Sobota 08)

    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const time = now.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    const fullDate = `${dd}.${mm}.${yyyy}`;

    const peselEggs = [
      "POWODZENIA!",
      "MATURATOR<3",
      "BEDZIE_30%+",
      "DUMNY_WYNIK",
      "100%_WIEDZY"
    ];
    const randomEgg = peselEggs[Math.floor(Math.random() * peselEggs.length)];
    const peselChars = randomEgg.padEnd(11, " ").slice(0, 11).split("");

    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";

    // KOD 
    ctx.font = `bold ${h * 0.025}px Cantarell`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";

    const codeStartX = w * 0.1555;
    const codeY = h * 0.176;
    const codeStep = w * 0.030;

    code.split("").forEach((char, index) => {
      ctx.fillText(char, codeStartX + (index * codeStep), codeY);
    });

    ctx.textAlign = "left";

    // DATA
    ctx.font = `bold ${h * 0.020}px Cantarell`;
    ctx.fillStyle = "#000";
    ctx.fillText(fullDate, w * 0.20, h * 0.586);

    // GODZINA
    ctx.fillText(time, w * 0.405, h * 0.6205);

    // PESEL
    ctx.font = `bold ${h * 0.025}px Cantarell`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";

    const startX = w * 0.278;
    const startY = h * 0.176;
    const stepX = w * 0.0285;

    peselChars.forEach((char, index) => {
      ctx.fillText(char, startX + (index * stepX), startY);
    });

    ctx.textAlign = "left"; // safety reset
  };


  if (status === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-xl w-full p-8 text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Symulator Matury</h1>
          <p className="text-foreground/70">
            Zostanie wygenerowany dla Ciebie pełny arkusz (ok. 30 zadań). Masz 170 minut.
            Po zakończeniu wyświetli się szczegółowy raport. Powodzenia!
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => setStatus("cover")} disabled={isLoading}>
              {isLoading ? "Generowanie arkusza..." : "Rozpocznij Egzamin"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (status === "cover") {
    return (
      <ExamCanvasCard
        imageSrc="/matura_strona1.png"
        title="Strona tytułowa arkusza"
        buttonText="Przejdź do instrukcji"
        onNext={() => setStatus("instruction")}
        drawOverlay={drawCoverOverlay}
      />
    );
  }

  if (status === "instruction") {
    return (
      <ExamCanvasCard
        imageSrc="/instrukcja.png"
        title="Instrukcja dla zdającego"
        buttonText="Przejdź do zadań (Start czasu)"
        onNext={() => setStatus("active")}
      />
    );
  }

  if (status === "finished" && exam) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8 text-center bg-foreground/10 border rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Egzamin Zakończony</h2>
            <div className="text-6xl font-black text-indigo-500 mb-4">{score}%</div>
            <p className="text-primary">Twój wynik z próbnym arkuszem.</p>
            <Button onClick={() => window.location.reload()} className="mt-6 cursor-pointer hover:opacity-60">Spróbuj ponownie</Button>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-bold ml-1">Szczegółowe rozwiązania:</h3>
            {exam.tasks.map((task, idx) => {
              const isCorrect = answers[idx] === task.answers.correct;
              return (
                <div key={idx} className={cn("border-[1.75px] rounded-lg overflow-hidden", isCorrect ? "border-green-200" : "border-red-100")}>
                  <div className={cn("p-2 px-4 text-sm font-bold flex justify-between", isCorrect ? "bg-green-50 text-green-700" : "bg-red-100 text-red-700")}>
                    <span>Zadanie {idx + 1}</span>
                    <span>{isCorrect ? "Dobrze" : "Źle"}</span>
                  </div>
                  <div className="p-4 bg-background/50">
                    <TaskCard
                      key={`review-${idx}`}
                      problem={task}
                      mode="exam_review"
                      externalAnswer={answers[idx]}
                      showNextButton={false}
                    />
                  </div>
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
    <main className="min-h-screen bg-background flex flex-col">
      <header className="bg-background border-b sticky top-0 z-10 shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-bold text-xl text-primary">Maturator</span>
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-mono">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <Button variant="destructive" size="sm" className="cursor-pointer hover:opacity-60" onClick={() => setStatus("finished")}>
            Zakończ egzamin
          </Button>
        </div>
        <Progress value={progress} className="h-1 mt-4 w-full absolute bottom-0 left-0 rounded-none" />
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

        <div className="order-2 lg:order-1">
          <div className="mb-4 text-primary font-medium">Zadanie {currentTaskIndex + 1} z {exam.tasks.length}</div>
          <TaskCard
            key={currentTaskIndex}
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

        <Card className="order-1 lg:order-2 bg-background/50 rounded-xl border p-4 shadow-sm">
          <CardHeader className="font-bold text-primary text-center">Mapa zadań</CardHeader>
          <div className="flex flex-wrap justify-center gap-2">
            {exam.tasks.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isCurrent = currentTaskIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentTaskIndex(idx)}
                  className={cn(
                    "w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-all",
                    isCurrent ? "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-primary" :
                      isAnswered ? "bg-primary/20 text-primary border border-primary/30" :
                        "bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer border"
                  )}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
          <CardContent className="p-4 bg-yellow-100 rounded-lg text-sm text-yellow-800 flex gap-2 items-start mt-4 dark:bg-yellow-900/30 dark:text-yellow-200">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Pamiętaj, aby zatwierdzić egzamin przed upływem czasu!</span>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
