"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { parseToLatex } from "@/lib/mathParser";
import { MathRenderer } from "./MathRenderer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MathInputProps {
  value: string;
  onChange: (value: string, latexValue: string) => void;
  disabled?: boolean;
  onEnter?: () => void;
  className?: string;
  placeholder?: string;
}

export const MathInput: React.FC<MathInputProps> = ({
  value,
  onChange,
  disabled,
  onEnter,
  className,
  placeholder = "Wpisz wynik..."
}) => {
  const [latexPreview, setLatexPreview] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLatexPreview(parseToLatex(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    onChange(rawVal, parseToLatex(rawVal));
  };

  const insertSymbol = (symbol: string, cursorPosOffset: number = 0) => {
    if (!inputRef.current || disabled) return;

    const start = inputRef.current.selectionStart || 0;
    const end = inputRef.current.selectionEnd || 0;
    const currentVal = inputRef.current.value;

    const newVal = currentVal.substring(0, start) + symbol + currentVal.substring(end);

    const event = { target: { value: newVal } } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(event);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(start + symbol.length + cursorPosOffset, start + symbol.length + cursorPosOffset);
      }
    }, 0);
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Pasek narzędzi */}
      <div className="flex flex-wrap gap-2 mb-2 p-1 bg-background/10 border rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertSymbol("/", 0)}
          disabled={disabled}
          title="Ułamek (klawisz /)"
          className="h-8 px-2"
        >
          <span className="font-serif italic">a/b</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertSymbol("sqrt()", -1)}
          disabled={disabled}
          title="Pierwiastek (wpisz sqrt)"
          className="h-8 px-2"
        >
          <span>√x</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertSymbol("^2")}
          disabled={disabled}
          title="Potęga (klawisz ^)"
          className="h-8 px-2"
        >
          <span>x²</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertSymbol("pi")}
          disabled={disabled}
          className="h-8 px-2"
        >
          <span>π</span>
        </Button>

        <div className="flex-1" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/50">
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-semibold mb-1">Skróty klawiszowe:</p>
              <ul className="text-xs space-y-1 list-disc pl-3">
                <li>Wpisz <b>/</b> aby zrobić ułamek (np. 1/2)</li>
                <li>Wpisz <b>sqrt(2)</b> dla pierwiastka <MathRenderer text="$$(\sqrt{2})$$" /></li>
                <li>Wpisz <b>pi</b> dla symbolu <MathRenderer text="$$(\pi)$$" /></li>
                <li>Użyj nawiasów <b>( )</b> do grupowania licznika, np. (x+1)/2</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) onEnter();
          }}
          disabled={disabled}
          placeholder={placeholder}
          className="font-mono text-base pr-4"
          autoComplete="off"
        />
      </div>

      <div className="min-h-[40px] px-3 mt-4 py-2 bg-background/10 border rounded-md flex items-center justify-start text-foreground/90 overflow-x-auto">
        <span className="text-xs text-foreground/65 mr-3 uppercase font-bold tracking-wider select-none">Podgląd:</span>
        {latexPreview ? (
          <MathRenderer text={`$$${latexPreview}$$`} />
        ) : (
          <span className="text-foreground/70 italic text-sm">Tu pojawi się matematyczny zapis...</span>
        )}
      </div>
    </div>
  );
};
