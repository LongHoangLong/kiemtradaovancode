
"use client";

import React from 'react';
import DiffMatchPatch, { Diff } from 'diff-match-patch';

interface CodeHighlighterProps {
  diffs: Diff[];
  originalA: string;
  originalB: string;
  fileA: string;
  fileB: string;
}

const getShortName = (name: string) => {
    const parts = name.split('/').pop()?.split('.') ?? [];
    return parts.slice(0, -1).join('.') || name;
};


export function CodeHighlighter({ diffs, fileA, fileB }: CodeHighlighterProps) {

  const renderSide = (type: 'A' | 'B') => {
    const filterOp = type === 'A' ? DiffMatchPatch.DIFF_INSERT : DiffMatchPatch.DIFF_DELETE;
    
    let lineNum = 1;
    const lines: { number: number; content: React.ReactNode[] }[] = [{ number: lineNum, content: [] }];

    for (const [op, text] of diffs) {
      if (op === filterOp) continue;

      const textLines = text.split('\n');
      textLines.forEach((lineText, i) => {
        if (lineText) {
          const highlight = op === DiffMatchPatch.DIFF_EQUAL;
          lines[lines.length - 1].content.push(
            <span key={`${i}-${Math.random()}`} className={highlight ? 'bg-yellow-200' : ''}>
              {lineText}
            </span>
          );
        }

        if (i < textLines.length - 1) {
          lineNum++;
          lines.push({ number: lineNum, content: [] });
        }
      });
    }

    return lines.map(({ number, content }, i) => (
      <tr key={i}>
        <td className="px-2 text-right text-muted-foreground select-none w-10 sticky top-0 bg-muted/50">{number}</td>
        <td className="whitespace-pre-wrap break-words pr-4 pl-2">
          {content.length > 0 ? content : <span>&nbsp;</span>}
        </td>
      </tr>
    ));
  };


  return (
    <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
            <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileA)}</h3>
            <div className="text-sm bg-muted/50 rounded-md font-code h-full border max-h-[600px] overflow-auto relative">
                <table className="w-full">
                    <tbody className='align-top'>
                        {renderSide('A')}
                    </tbody>
                </table>
            </div>
        </div>
        <div>
            <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileB)}</h3>
            <div className="text-sm bg-muted/50 rounded-md font-code h-full border max-h-[600px] overflow-auto relative">
                <table className="w-full">
                    <tbody className='align-top'>
                        {renderSide('B')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
