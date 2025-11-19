
"use client";

import React from 'react';
import DiffMatchPatch, { Diff } from 'diff-match-patch';

interface CodeHighlighterProps {
  diffs: Diff[];
  type: 'A' | 'B';
}

export function CodeHighlighter({ diffs, type }: CodeHighlighterProps) {

  const getHighlightColor = (op: number) => {
    switch(op) {
      case DiffMatchPatch.DIFF_INSERT:
        return type === 'B' ? 'rgba(0, 255, 0, 0.2)' : 'transparent';
      case DiffMatchPatch.DIFF_DELETE:
        return type === 'A' ? 'rgba(255, 0, 0, 0.2)' : 'transparent';
      case DiffMatchPatch.DIFF_EQUAL:
        return 'rgba(255, 255, 0, 0.3)';
      default:
        return 'transparent';
    }
  };

  const getTextDecoration = (op: number) => {
    if (type === 'A' && op === DiffMatchPatch.DIFF_DELETE) {
      return 'line-through';
    }
    return 'none';
  }

  return (
    <pre className="text-sm bg-muted/50 p-4 rounded-md overflow-x-auto font-code h-full whitespace-pre-wrap break-words">
      <code>
        {diffs.map(([op, text], index) => {
          if ((type === 'A' && op === DiffMatchPatch.DIFF_INSERT) || (type === 'B' && op === DiffMatchPatch.DIFF_DELETE)) {
            // Don't render the 'other' file's additions/deletions
            return null;
          }
          return (
            <span
              key={index}
              style={{
                backgroundColor: getHighlightColor(op),
                textDecoration: getTextDecoration(op),
              }}
            >
              {text}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
