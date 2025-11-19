
"use client";

import React from 'react';

interface CodeHighlighterProps {
  code: string;
  matchedLines: number[];
}

export function CodeHighlighter({ code, matchedLines }: CodeHighlighterProps) {
  const lines = code.split('\n');
  const matchedLinesSet = new Set(matchedLines);

  return (
    <pre className="text-sm bg-muted/50 p-4 rounded-md overflow-x-auto font-code h-full whitespace-pre-wrap break-words">
      <code>
        {lines.map((line, index) => (
          <div
            key={index}
            style={{
              backgroundColor: matchedLinesSet.has(index) ? 'rgba(255, 255, 0, 0.3)' : 'transparent',
              display: 'block',
              width: '100%',
            }}
          >
            {line.length > 0 ? line : <>&nbsp;</>}
          </div>
        ))}
      </code>
    </pre>
  );
}
