
"use client";

import React from 'react';
import DiffMatchPatch, { Diff } from 'diff-match-patch';

interface CodeHighlighterProps {
  diffs: Diff[];
}

const renderDiff = (diffs: Diff[]) => {
  const dmp = new DiffMatchPatch();
  const lines = dmp.diff_linesToChars_(diffs[0][1], diffs[1][1]);
  const lineText1 = lines.chars1;
  const lineText2 = lines.chars2;
  const lineArray = lines.lineArray;

  const diffsResult = dmp.diff_main(lineText1, lineText2, false);
  dmp.diff_charsToLines_(diffsResult, lineArray);

  let html = '';
  for (const diff of diffsResult) {
    const op = diff[0];
    const text = diff[1];
    const bgColor = op === DiffMatchPatch.DIFF_EQUAL ? 'rgba(255, 255, 0, 0.2)' : 'transparent';
    const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html += `<span style="background-color: ${bgColor}">${escapedText}</span>`;
  }
  return html;
};


export function CodeHighlighter({ diffs }: CodeHighlighterProps) {
  const originalCode = diffs.map(d => d[1]).join('');

  // This is a simplified approach to split the rendered diffs into two panes.
  // It assumes the diffs prop contains the two original codes for simplicity,
  // and the actual diffing for highlighting happens inside.
  // A proper implementation would need to align lines between two panes.

  const renderSide = (type: 'A' | 'B') => {
    let lineNum = 1;
    const codeToDisplay = (type === 'A' ? diffs.find(d => d[0] === DiffMatchPatch.DIFF_DELETE || d[0] === DiffMatchPatch.DIFF_EQUAL) : diffs.find(d => d[0] === DiffMatchPatch.DIFF_INSERT || d[0] === DiffMatchPatch.DIFF_EQUAL))?.[1] || '';
    
    let combinedDiffs: Diff[] = [];
    if (type === 'A') {
        combinedDiffs = diffs.filter(d => d[0] !== DiffMatchPatch.DIFF_INSERT);
    } else {
        combinedDiffs = diffs.filter(d => d[0] !== DiffMatchPatch.DIFF_DELETE);
    }


    return combinedDiffs.map(([op, text], i) => {
        const style: React.CSSProperties = {
            backgroundColor: op === DiffMatchPatch.DIFF_EQUAL ? 'rgba(252, 219, 3, 0.2)' : 'transparent',
            whiteSpace: 'pre-wrap',
            display: 'block'
        };

        const lines = text.split('\n');
        return lines.map((line, lineIndex) => {
            if (lineIndex === lines.length - 1 && line === '') {
                return null;
            }
            
            const currentLineNumber = lineNum++;

            return (
                 <tr key={`${i}-${lineIndex}`} style={{backgroundColor: style.backgroundColor}}>
                     <td className="px-2 text-right text-muted-foreground select-none w-10">{currentLineNumber}</td>
                     <td className="whitespace-pre-wrap break-words pr-4 pl-2">
                         <span>{line}</span>
                     </td>
                 </tr>
            )
        })
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
        <div>
            <h3 className="font-semibold mb-2">{diffs.find(d => d[0] === -1)?.toString() || "File A"}</h3>
            <div className="text-sm bg-muted/50 rounded-md overflow-x-auto font-code h-full border">
                <table className="w-full">
                    <tbody>
                        {renderSide('A')}
                    </tbody>
                </table>
            </div>
        </div>
        <div>
            <h3 className="font-semibold mb-2">{diffs.find(d => d[0] === 1)?.toString() || "File B"}</h3>
            <div className="text-sm bg-muted/50 rounded-md overflow-x-auto font-code h-full border">
                <table className="w-full">
                    <tbody>
                        {renderSide('B')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
