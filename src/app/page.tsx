import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calculator, GraduationCap, Sparkles } from "lucide-react";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="flex flex-col items-center">

      <section className="w-full py-20 bg-background border-b">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <Badge variant="secondary" className="mb-4 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-1 text-sm">
            <Sparkles className="w-3 h-3 mr-2 fill-indigo-600" />
            Nowoczesna nauka matematyki
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground/95 leading-[1.1]">
            Zdominuj Maturę <br /> <span className="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-t from-foreground/60 to-foreground/80">Nieskończona Baza Zadań</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Maturator to inteligentny generator, który tworzy unikalne zadania matematyczne w czasie rzeczywistym.
            Ćwicz konkretne działy <br className="hidden md:flex" /> lub sprawdź się w pełnym symulatorze egzaminu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/trening">Rozpocznij Trening</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
              <Link href="/egzamin">Symulator Egzaminu</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12 text-foreground/85">Wybierz tryb nauki</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/trening" className="group">
              <Card className="h-full hover:shadow-xl hover:border-indigo-200 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Calculator className="w-32 h-32 text-indigo-600" />
                </div>
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-500 group-hover:scale-110 transition-transform">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl">Trening Tematyczny</CardTitle>
                  <CardDescription className="text-base">
                    Idealny do nauki i powtórek. <br /> Wybierz konkretny dział i rozwiązuj zadania do skutku.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600 mb-6">
                    <li className="flex items-center gap-2 text-foreground/90"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> 12 generatorów tematycznych</li>
                    <li className="flex items-center gap-2 text-foreground/90"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Wybór poziomu trudności</li>
                    <li className="flex items-center gap-2 text-foreground/90"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Natychmiastowe sprawdzanie</li>
                  </ul>
                  <Button variant="ghost" className="group-hover:translate-x-2 transition-transform p-0 hover:bg-transparent text-indigo-500">
                    Wybierz tryb <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Karta Egzamin */}
            <Link href="/egzamin" className="group">
              <Card className="h-full hover:shadow-xl hover:border-violet-200 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <GraduationCap className="w-32 h-32 text-violet-600" />
                </div>
                <CardHeader>
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4 text-violet-600 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl">Symulator Matury</CardTitle>
                  <CardDescription className="text-base">
                    Sprawdź swoją wiedzę w warunkach egzaminacyjnych. Pełny arkusz, limit czasu i punktacja końcowa.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600 mb-6">
                    <li className="flex items-center gap-2 text-foreground/90"><div className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Pełny arkusz (~30 zadań)</li>
                    <li className="flex items-center gap-2 text-foreground/90"><div className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Timer 170 minut</li>
                    <li className="flex items-center gap-2 text-foreground/90"><div className="w-1.5 h-1.5 rounded-full bg-violet-400" /> Szczegółowy raport wyników</li>
                  </ul>
                  <Button variant="ghost" className="group-hover:translate-x-2 transition-transform p-0 hover:bg-transparent text-violet-500">
                    Wybierz tryb <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
