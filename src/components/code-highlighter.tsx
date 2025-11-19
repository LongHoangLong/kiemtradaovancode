
"use client";

import React from 'react';
import DiffMatchPatch, { Diff } from 'diff-match-patch';

interface CodeHighlighterProps {
  diffs: Diff[];
  fileA: string;
  fileB: string;
}

const getShortName = (name: string) => {
    const parts = name.split('/').pop()?.split('.') ?? [];
    return parts.slice(0, -1).join('.') || name;
};

const DiffRenderer = ({ diffs, opToShow }: { diffs: Diff[], opToShow: 1 | -1 }) => {
    return (
        <pre className="text-sm bg-muted/50 rounded-md font-code h-full border max-h-[600px] overflow-auto relative p-2 whitespace-pre-wrap">
            <code>
                {diffs.map(([op, text], index) => {
                    if (op === 0) { // Equal
                        return <span key={index} className="bg-yellow-200">{text}</span>;
                    }
                    if (op === opToShow) {
                        return <span key={index}>{text}</span>;
                    }
                    return null;
                })}
            </code>
        </pre>
    );
};


export function CodeHighlighter({ diffs, fileA, fileB }: CodeHighlighterProps) {
    return (
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileA)}</h3>
                <DiffRenderer diffs={diffs} opToShow={-1} />
            </div>
            <div>
                <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileB)}</h3>
                <DiffRenderer diffs={diffs} opToShow={1} />
            </div>
        </div>
    );
}
