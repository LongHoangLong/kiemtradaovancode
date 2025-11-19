
"use client";

import { DIFF_EQUAL, DIFF_DELETE, DIFF_INSERT } from "diff-match-patch";
import type { diff_match_patch } from "diff-match-patch";

type Diff = [number, string];

interface CodeHighlighterProps {
    diffs: Diff[];
}

export function CodeHighlighter({ diffs }: CodeHighlighterProps) {
    return (
        <pre className="text-sm bg-muted/50 p-4 rounded-md overflow-x-auto font-code h-full">
            <code>
                {diffs.map((diff, index) => {
                    const type = diff[0];
                    const text = diff[1];
                    let style = {};
                    if (type === DIFF_EQUAL) {
                        style = { backgroundColor: 'rgba(255, 255, 0, 0.3)' };
                    } else if (type === DIFF_DELETE) {
                        style = { backgroundColor: 'rgba(255, 0, 0, 0.2)', textDecoration: 'line-through' };
                    } else if (type === DIFF_INSERT) {
                        style = { backgroundColor: 'rgba(0, 255, 0, 0.2)' };
                    }

                    return <span key={index} style={style}>{text}</span>;
                })}
            </code>
        </pre>
    );
}
