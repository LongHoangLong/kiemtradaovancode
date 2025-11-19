
"use client";

import React from 'react';

interface CodeViewerProps {
  code: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  return (
    <pre className="text-sm bg-muted/50 rounded-md font-code h-full border max-h-[600px] overflow-auto relative p-4 whitespace-pre-wrap">
      <code>
        {code}
      </code>
    </pre>
  );
};

interface CodeHighlighterProps {
  codeA: string;
  codeB: string;
  fileA: string;
  fileB: string;
}

const getShortName = (name: string) => {
    const parts = name.split('/').pop()?.split('.') ?? [];
    return parts.slice(0, -1).join('.') || name;
};

export function CodeHighlighter({ codeA, codeB, fileA, fileB }: CodeHighlighterProps) {
    return (
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
                <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileA)}</h3>
                <CodeViewer code={codeA} />
            </div>
            <div>
                <h3 className="font-semibold mb-2 sticky top-0 bg-card py-2 z-10">{getShortName(fileB)}</h3>
                <CodeViewer code={codeB} />
            </div>
        </div>
    );
}
