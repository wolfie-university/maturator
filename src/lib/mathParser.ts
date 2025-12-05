export const parseToLatex = (input: string): string => {
  if (!input) return "";

  let latex = input;

  latex = latex.replace(/\*/g, " \\cdot ");
  latex = latex.replace(/<=/g, " \\le ");
  latex = latex.replace(/>=/g, " \\ge ");
  latex = latex.replace(/\bpi\b/g, "\\pi");
  latex = latex.replace(/\binf\b/g, "\\infty");

  latex = latex.replace(/sqrt\(([^)]+)\)/g, "\\sqrt{$1}");
  latex = latex.replace(/sqrt(\d+)/g, "\\sqrt{$1}");

  const fractionRegex =
    /((\([^)]+\))|([0-9a-zA-Z\.]+(?:\^[0-9]+)?))\s*\/\s*((\([^)]+\))|([0-9a-zA-Z\.]+(?:\^[0-9]+)?))/g;

  while (latex.match(fractionRegex)) {
    latex = latex.replace(
      fractionRegex,
      (match, num, numParen, numSimple, den, denParen, denSimple) => {
        const cleanNum = numParen ? numParen.slice(1, -1) : numSimple;
        const cleanDen = denParen ? denParen.slice(1, -1) : denSimple;
        return `\\frac{${cleanNum}}{${cleanDen}}`;
      },
    );
  }

  return latex;
};

export const normalizeAnswer = (ans: string): string => {
  let clean = ans.replace(/\s+/g, "");
  clean = parseToLatex(clean);
  return clean;
};
