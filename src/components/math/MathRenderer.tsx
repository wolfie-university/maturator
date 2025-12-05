"use client";

import React from "react";
import { InlineMath, BlockMath } from "react-katex";

interface MathRendererProps {
  text: string;
  block?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ text, block = false, className }) => {
  if (!text) return null;

  const parts = text.split("$$");

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return block ? (
            <BlockMath key={index} math={part} />
          ) : (
            <InlineMath key={index} math={part} />
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};
