"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ExamCanvasCardProps {
  imageSrc: string;
  title: string;
  buttonText: string;
  onNext: () => void;
  drawOverlay?: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const ExamCanvasCard = ({
  imageSrc,
  title,
  buttonText,
  onNext,
  drawOverlay,
}: ExamCanvasCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      if (drawOverlay) {
        drawOverlay(ctx, img.width, img.height);
      }

      setIsLoaded(true);
    };
  }, [imageSrc, drawOverlay]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <Card className="max-w-3xl w-full shadow-lg">
        <CardHeader className="text-center font-bold text-xl pb-2">
          {title}
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="relative w-full border rounded-md overflow-hidden bg-white shadow-sm">
            <canvas
              ref={canvasRef}
              className="w-full h-auto block"
            />
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <span className="text-muted-foreground animate-pulse">Ładowanie arkusza...</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button
            size="lg"
            onClick={onNext}
            className="gap-2 w-full md:w-auto"
            disabled={!isLoaded}
          >
            {buttonText} <ArrowRight className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
