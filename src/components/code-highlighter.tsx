
"use client";

import React from 'react';
import { diff_match_patch, DIFF_EQUAL, DIFF_DELETE, DIFF_INSERT } from 'diff-match-patch';

interface HighlightedCodeProps {
  diffs: [number, string][];
  diffType: typeof DIFF_INSERT | typeof DIFF_DELETE;
}

const HighlightedCode: React.FC<HighlightedCodeProps> = ({ diffs, diffType }) => {
  return (
    <pre className="text-sm bg-muted/50 rounded-md font-code h-full border max-h-[600px] overflow-auto relative p-4 whitespace-pre-wrap">
      <code>
        {diffs.map(([type, text], index) => {
          if (type === DIFF_EQUAL) {
            return <span key={index} className="bg-yellow-200">{text}</span>;
          }
          if (type === diffType) {
            return <span key={index}>{text}</span>;
          }
          return null;
        })}
      </code>
    </pre>
  );
};

interface CodeHighlighterProps {
  diffs: [number, string][];
  fileA: string;
  fileB: string;
}

const getShortName = (name: string) => {
    const parts = name.split('/').pop()?.split('.') ?? [];
    return parts.slice(0, -1).join('.') || name;
};

export function CodeHighlighter({ diffs, fileA, fileB }: CodeHighlighterProps) {
    return (
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileA)}</h3>
                <HighlightedCode diffs={diffs} diffType={DIFF_DELETE} />
            </div>
            <div>
                <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileB)}</h3>
                <HighlightedCode diffs={diffs} diffType={DIFF_INSERT} />
            </div>
        </div>
    );
}
