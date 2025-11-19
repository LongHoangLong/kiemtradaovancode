
"use client";

interface CodeHighlighterProps {
    code: string;
}

export function CodeHighlighter({ code }: CodeHighlighterProps) {
    return (
        <pre className="text-sm bg-muted/50 p-4 rounded-md overflow-x-auto font-code">
            <code>
                {code}
            </code>
        </pre>
    );
}
