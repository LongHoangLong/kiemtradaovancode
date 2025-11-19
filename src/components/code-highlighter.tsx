
"use client";

import React from 'react';
import DiffMatchPatch, { Diff } from 'diff-match-patch';

interface CodeHighlighterProps {
  diffs: Diff[];
  type: 'A' | 'B';
}

const renderDiff = (diffs: Diff[], type: 'A' | 'B') => {
  let html = '';
  let lineNum = 1;
  const lines = diffsToLines(diffs, type);

  return lines.map((line, index) => {
    const { op, text } = line;
    let symbol = ' ';
    let bgColor = 'transparent';
    let textColor = 'inherit';

    if (op === DiffMatchPatch.DIFF_INSERT) {
      symbol = '+';
      bgColor = 'rgba(46, 160, 67, 0.15)';
      textColor = '#e6ffec';
    } else if (op === DiffMatchPatch.DIFF_DELETE) {
      symbol = '-';
      bgColor = 'rgba(248, 81, 73, 0.15)';
      textColor = '#ffebe9';
    }

    return (
      <tr key={index} style={{ backgroundColor: bgColor }}>
        <td className="px-2 text-right text-muted-foreground select-none w-10">{lineNum++}</td>
        <td className="px-2 text-muted-foreground select-none w-4">{symbol}</td>
        <td className="whitespace-pre-wrap break-words pr-4">
          <span style={{ color: textColor }}>{text}</span>
        </td>
      </tr>
    );
  });
};

const diffsToLines = (diffs: Diff[], type: 'A' | 'B') => {
  const lines: { op: number; text: string }[] = [];
  let currentLine = '';
  let lineOp = DiffMatchPatch.DIFF_EQUAL;

  for (let i = 0; i < diffs.length; i++) {
    const [op, text] = diffs[i];

    if (
      (type === 'A' && op === DiffMatchPatch.DIFF_INSERT) ||
      (type === 'B' && op === DiffMatchPatch.DIFF_DELETE)
    ) {
      continue;
    }

    if (lineOp === DiffMatchPatch.DIFF_EQUAL) {
        lineOp = op;
    }

    const textParts = text.split('\n');
    currentLine += textParts[0];

    for (let j = 1; j < textParts.length; j++) {
      lines.push({ op: lineOp, text: currentLine });
      currentLine = textParts[j];
      lineOp = op;
    }
  }
  
  // Add the last line if it's not empty
  if (currentLine) {
    lines.push({ op: lineOp, text: currentLine });
  }

  return lines;
};


export function CodeHighlighter({ diffs, type }: CodeHighlighterProps) {
  return (
    <div className="text-sm bg-muted/50 rounded-md overflow-x-auto font-code h-full border">
      <table className="w-full">
        <tbody>
          {renderDiff(diffs, type)}
        </tbody>
      </table>
    </div>
  );
}
