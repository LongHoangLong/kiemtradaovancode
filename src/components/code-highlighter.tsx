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
    const renderDiff = () => {
        const aLines: React.ReactNode[] = [];
        const bLines: React.ReactNode[] = [];
        let aLineNum = 1;
        let bLineNum = 1;

        const processChunk = (text: string, className: string, side: 'A' | 'B' | 'both') => {
            const lines = text.split('\n');
            lines.forEach((line, i) => {
                const lineContent = <span className={className}>{line}</span>;
                const isLastLineAndEmpty = i === lines.length - 1 && line === '';

                if (isLastLineAndEmpty) {
                    if (lines.length > 1) { // Only add new line if it's not a single empty string
                        if (side === 'A') {
                            aLines.push(<div key={`a-${aLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">{aLineNum++}</span></div>);
                        }
                        if (side === 'B') {
                            bLines.push(<div key={`b-${bLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">{bLineNum++}</span></div>);
                        }
                         if (side === 'both') {
                            aLines.push(<div key={`a-${aLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">{aLineNum++}</span></div>);
                            bLines.push(<div key={`b-${bLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">{bLineNum++}</span></div>);
                        }
                    }
                    return;
                }
                
                 if (side === 'A') {
                    aLines.push(<div key={`a-${aLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">{aLineNum++}</span>{lineContent}</div>);
                    bLines.push(<div key={`b-${bLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">&nbsp;</span></div>);
                } else if (side === 'B') {
                    aLines.push(<div key={`a-${aLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">&nbsp;</span></div>);
                    bLines.push(<div key={`b-${bLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">{bLineNum++}</span>{lineContent}</div>);
                } else { // both
                    aLines.push(<div key={`a-${aLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">{aLineNum++}</span>{lineContent}</div>);
                    bLines.push(<div key={`b-${bLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">{bLineNum++}</span>{lineContent}</div>);
                }
            });
        };

        diffs.forEach(([op, text]) => {
            switch (op) {
                case DiffMatchPatch.DIFF_EQUAL:
                    processChunk(text, 'bg-yellow-200', 'both');
                    break;
                case DiffMatchPatch.DIFF_DELETE:
                    processChunk(text, '', 'A');
                    break;
                case DiffMatchPatch.DIFF_INSERT:
                    processChunk(text, '', 'B');
                    break;
            }
        });

        // Align lengths
        while (aLines.length < bLines.length) {
            aLines.push(<div key={`a-${aLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">&nbsp;</span></div>);
        }
        while (bLines.length < aLines.length) {
            bLines.push(<div key={`b-${bLines.length}`}><span className="w-10 inline-block text-right pr-2 text-muted-foreground select-none">&nbsp;</span></div>);
        }

        return { aLines, bLines };
    };

    const { aLines, bLines } = renderDiff();

    return (
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileA)}</h3>
                <div className="text-sm bg-muted/50 rounded-md font-code h-full border max-h-[600px] overflow-auto relative p-2">
                    <div className="whitespace-pre">{aLines}</div>
                </div>
            </div>
            <div>
                <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileB)}</h3>
                <div className="text-sm bg-muted/50 rounded-md font-code h-full border max-h-[600px] overflow-auto relative p-2">
                    <div className="whitespace-pre">{bLines}</div>
                </div>
            </div>
        </div>
    );
}