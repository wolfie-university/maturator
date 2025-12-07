"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Globe, ArrowLeft, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background py-8 px-6 md:px-12">
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-lg font-bold text-indigo-700 dark:text-indigo-300">
              SW
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Szymon Wilczek</h3>
              <p className="text-sm text-muted-foreground">Twórca projektu</p>
            </div>
          </div>

          <p className="mb-8">
            Jestem pasjonatem programowania, który wierzy, że edukacja powinna być darmowa,
            dostępna i - przede wszystkim - angażująca. Tworzę narzędzia, z których sam chciałbym korzystać, będąc w szkole.
            Przyświeca mi pewna misja dziejowa: uczynić naukę matematyki przyjemniejszą i bardziej efektywną dla każdego ucznia.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <Button asChild variant="outline" className="gap-2 h-11 px-6">
              <Link href="https://github.com/szymonwilczek" target="_blank">
                <Github className="w-4 h-4" />
                GitHub
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 h-11 px-6">
              <Link href="https://szymon-wilczek.me" target="_blank">
                <Globe className="w-4 h-4" />
                Strona WWW
              </Link>
            </Button>
          </div>
        </section>

        <Separator className="my-8" />

        <header className="mb-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
            Maturator
          </h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">
            Czyli o tym, jak próbuję naprawić naukę matematyki za pomocą kodu.
          </p>
        </header>

        <article className="space-y-4 text-lg leading-relaxed text-foreground/85">
          <p>
            Matura z matematyki to dla wielu uczniów moment stresu i niepewności.
            Tradycyjne zbiory zadań mają jedną wadę: <strong>zadania się kończą</strong>.
            Kiedy rozwiążesz je wszystkie, zaczynasz uczyć się odpowiedzi na pamięć, zamiast rozumieć schematy.
          </p>

          <p>
            Maturator powstał jako odpowiedź na ten problem. To nie jest zwykła baza danych.
            To silnik, który generuje zadania w czasie rzeczywistym. Dzięki temu
            każde podejście do egzaminu jest unikalne, a Ty uczysz się elastycznego myślenia,
            nie "zakuwania" klucza.
          </p>

          <div className="p-6 bg-muted/30 border-l-4 border-indigo-500 rounded-r-lg my-8 italic text-base">
            "Celem nie jest zaliczenie. Celem jest zrozumienie, że matematyka to tylko logiczna układanka, której zasady są stałe."
          </div>

          <h3 className="text-2xl font-bold text-foreground mt-12 mb-4">Technologia</h3>
          <p>
            Jako projekt Open Source, Maturator stawia na transparentność i nowoczesność.
            Całość została zbudowana w oparciu o <strong>Next.js</strong>, wykorzystując potęgę
            komponentów serwerowych oraz dynamiczne renderowanie wykresów SVG.
          </p>
        </article>

        <div className="mt-8 pt-8 border-t flex items-center justify-center text-sm text-muted-foreground gap-2">
          Stworzono dla maturzystów z <Heart className="w-4 h-4 text-red-500 fill-red-500" /> w 2025.
        </div>

      </div>
    </main>
  );
}
