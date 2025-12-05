"use client";

import { TaskCard } from "@/components/math/TaskCard";
import { useRandomProblem } from "@/hooks/useMathApi";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Home() {
  // Pobieramy losowe zadanie
  const { data, isLoading, refetch, isError } = useRandomProblem("medium");

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Maturator</h1>
          <p>Twój nieskończony generator zadań maturalnych.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500">
            Błąd połączenia z API. Sprawdź czy backend działa na porcie 3333.
          </div>
        ) : data ? (
          <TaskCard
            problem={data}
            onNext={() => refetch()}
          />
        ) : null}
      </div>
    </main>
  );
}
