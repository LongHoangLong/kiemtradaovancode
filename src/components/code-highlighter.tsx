
"use client";

import React from 'react';
import DiffMatchPatch from 'diff-match-patch';

interface CodeHighlighterProps {
  diffs: [number, string][];
  type: 'A' | 'B';
}

export function CodeHighlighter({ diffs, type }: CodeHighlighterProps) {
  const DIFF_DELETE = -1;
  const DIFF_INSERT = 1;
  const DIFF_EQUAL = 0;

  return (
    <pre className="text-sm bg-muted/50 p-4 rounded-md overflow-x-auto font-code h-full whitespace-pre-wrap break-words">
      <code>
        {diffs.map(([op, text], index) => {
          if (type === 'A' && op === DIFF_DELETE) {
            return (
              <span key={index} style={{ backgroundColor: 'rgba(255, 0, 0, 0.2)' }}>
                {text}
              </span>
            );
          }
          if (type === 'B' && op === DIFF_INSERT) {
            return (
              <span key={index} style={{ backgroundColor: 'rgba(0, 255, 0, 0.2)' }}>
                {text}
              </span>
            );
          }
          if (op === DIFF_EQUAL) {
            return (
              <span key={index} style={{ backgroundColor: 'rgba(255, 255, 0, 0.2)' }}>
                {text}
              </span>
            );
          }
          // Render the text without background for parts that don't match the side
          if ((type === 'A' && op === DIFF_INSERT) || (type === 'B' && op === DIFF_DELETE)) {
            const lines = text.split('\n').length - 1;
            return Array.from({ length: lines }).map((_, i) => <br key={`${index}-${i}`} />);
          }
          return <React.Fragment key={index}>{text}</React.Fragment>;
        })}
      </code>
    </pre>
  );
}
