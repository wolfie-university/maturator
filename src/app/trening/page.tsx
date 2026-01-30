"use client";

import { useState } from "react";
import { TOPICS } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTopicProblem } from "@/hooks/useMathApi";
import { TaskCard } from "@/components/math/TaskCard";
import { Difficulty } from "@/types/api";

export default function TrainingPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const { data: problem, isLoading, refetch, isFetching } = useTopicProblem(selectedTopic || "", difficulty);

  const activeTopicInfo = TOPICS.find(t => t.id === selectedTopic);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Trening Tematyczny</h1>
            <p className="text-foreground/70">Wybierz dział i szlifuj umiejętności.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground/70">Poziom trudności:</span>
            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Łatwy</SelectItem>
                <SelectItem value="medium">Średni</SelectItem>
                <SelectItem value="hard">Trudny</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!selectedTopic && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((topic) => (
              <Card
                key={topic.id}
                className="hover:shadow-md transition-all cursor-pointer hover:border-indigo-300 group"
                onClick={() => setSelectedTopic(topic.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                      <topic.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{topic.name}</CardTitle>
                  </div>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {selectedTopic && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <Button
              variant="ghost"
              className="mb-4 gap-2 text-neutral-500 hover:text-neutral-200 pl-0"
              onClick={() => setSelectedTopic(null)}
            >
              <ArrowLeft className="w-4 h-4" /> Wróć do listy tematów
            </Button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {activeTopicInfo?.name}
                {isFetching && <Loader2 className="w-5 h-5 animate-spin text-slate-400" />}
              </h2>
            </div>

            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-200" />
              </div>
            ) : problem ? (
              <TaskCard
                problem={problem}
                onNext={() => refetch()}
              />
            ) : (
              <div className="text-center py-10 text-red-500">Nie udało się załadować zadania.</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
