
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


export function CodeHighlighter({ diffs, originalA, originalB, fileA, fileB }: CodeHighlighterProps) {

  const renderSide = (type: 'A' | 'B') => {
    const relevantDiffs = type === 'A'
      ? diffs.filter(d => d[0] !== DiffMatchPatch.DIFF_INSERT)
      : diffs.filter(d => d[0] !== DiffMatchPatch.DIFF_DELETE);

    const lines: React.ReactNode[][] = [[]];
    
    relevantDiffs.forEach(([op, text]) => {
      const textLines = text.split('\n');
      textLines.forEach((line, index) => {
        if (line) {
          lines[lines.length - 1].push(
            <span key={`${index}-${Math.random()}`} style={{ backgroundColor: op === DiffMatchPatch.DIFF_EQUAL ? 'rgba(252, 219, 3, 0.3)' : 'transparent' }}>
              {line}
            </span>
          );
        }
        if (index < textLines.length - 1) {
          lines.push([]);
        }
      });
    });

    return lines.map((lineContent, i) => (
      <tr key={i}>
        <td className="px-2 text-right text-muted-foreground select-none w-10 sticky top-0 bg-muted/50">{i + 1}</td>
        <td className="whitespace-pre-wrap break-words pr-4 pl-2">
            {lineContent.length > 0 ? lineContent : <span>&nbsp;</span>}
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
