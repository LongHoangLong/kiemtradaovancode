
"use client";

import { diff_match_patch, DIFF_EQUAL, DIFF_DELETE, DIFF_INSERT } from "diff-match-patch";
import { cn } from "@/lib/utils";

interface CodeHighlighterProps {
    diffs: ReturnType<diff_match_patch['diff_main']>;
    view: 'A' | 'B';
}

export function CodeHighlighter({ diffs, view }: CodeHighlighterProps) {
    const filterOp = view === 'A' ? DIFF_INSERT : DIFF_DELETE;

    return (
        <pre className="text-sm bg-muted/50 p-4 rounded-md overflow-x-auto font-code">
            <code>
                {diffs.map(([op, text], i) => {
                    if (op === filterOp) {
                        return null;
                    }
                    const isSimilar = op === DIFF_EQUAL;
                    return (
                        <span key={i} className={cn(isSimilar && "bg-yellow-200/50")}>
                            {text}
                        </span>
                    );
                })}
            </code>
        </pre>
    );
}
