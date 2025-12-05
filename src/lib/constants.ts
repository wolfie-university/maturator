import {
  Calculator,
  SquareFunction,
  Shapes,
  Ruler,
  PieChart,
  Binary,
  Sigma,
  Box,
  TriangleRight,
  ChartNoAxesCombined,
  DraftingCompass,
  ChartColumn,
} from "lucide-react";

export const TOPICS = [
  {
    id: "algebra",
    name: "Liczby i Algebra",
    icon: Calculator,
    description: "Potęgi, pierwiastki, logarytmy, procenty.",
  },
  {
    id: "functions-general",
    name: "Funkcje (Ogólne)",
    icon: SquareFunction,
    description: "Własności funkcji, przesuwanie wykresów.",
  },
  {
    id: "quadratic",
    name: "Funkcja Kwadratowa",
    icon: DraftingCompass,
    description: "Wierzchołki, miejsca zerowe, nierówności.",
  },
  {
    id: "optimization",
    name: "Optymalizacja",
    icon: ChartNoAxesCombined,
    description: "Zadania tekstowe na min/max.",
  },
  {
    id: "sequences",
    name: "Ciągi",
    icon: Sigma,
    description: "Arytmetyczne, geometryczne, wzory.",
  },
  {
    id: "analytic",
    name: "Geometria Analityczna",
    icon: Ruler,
    description: "Proste, odcinki, geometria w układzie.",
  },
  {
    id: "planimetry",
    name: "Planimetria",
    icon: Shapes,
    description: "Trójkąty, czworokąty, okręgi.",
  },
  {
    id: "stereometry",
    name: "Stereometria",
    icon: Box,
    description: "Bryły, kąty w przestrzeni.",
  },
  {
    id: "trigonometry",
    name: "Trygonometria",
    icon: TriangleRight,
    description: "Kąty, tożsamości, wzory.",
  },
  {
    id: "combinatorics",
    name: "Kombinatoryka",
    icon: Binary,
    description: "Reguła mnożenia, permutacje.",
  },
  {
    id: "probability",
    name: "Prawdopodobieństwo",
    icon: PieChart,
    description: "Kostki, monety, urny.",
  },
  {
    id: "statistics",
    name: "Statystyka",
    icon: ChartColumn,
    description: "Średnia, mediana, odchylenie.",
  },
];
