
"use client";

import React from 'react';

interface CodeHighlighterProps {
  code: string;
  tokensToHighlight: string[];
}

// Escape special characters in a string for use in a RegExp
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export function CodeHighlighter({ code, tokensToHighlight }: CodeHighlighterProps) {
  if (!tokensToHighlight || tokensToHighlight.length === 0) {
    return (
      <pre className="text-sm bg-muted/50 p-4 rounded-md overflow-x-auto font-code h-full">
        <code>{code}</code>
      </pre>
    );
  }

  // Create a regex to find all occurrences of the tokens to highlight.
  // The tokens are sorted by length descending to match longer tokens first (e.g., "==" before "=").
  const sortedTokens = [...tokensToHighlight].sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${sortedTokens.map(escapeRegExp).join('|')})`, 'g');
  
  const parts = code.split(regex);

  return (
    <pre className="text-sm bg-muted/50 p-4 rounded-md overflow-x-auto font-code h-full">
      <code>
        {parts.map((part, index) =>
          tokensToHighlight.includes(part) ? (
            <span key={index} style={{ backgroundColor: 'rgba(255, 255, 0, 0.4)' }}>
              {part}
            </span>
          ) : (
            <React.Fragment key={index}>{part}</React.Fragment>
          )
        )}
      </code>
    </pre>
  );
}
