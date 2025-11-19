
"use client";

import { useLanguage } from "@/contexts/language-context";
import { DetailedComparisonInfo } from "@/types/plagiarism";
import { Button } from "./ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { CodeHighlighter } from "./code-highlighter";
import { DIFF_DELETE, DIFF_INSERT } from "diff-match-patch";

interface DetailedComparisonProps {
    info: DetailedComparisonInfo;
    onBack: () => void;
}

const InfoCard = ({ title, value }: { title: string, value: string | number }) => (
    <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);

export function DetailedComparison({ info, onBack }: DetailedComparisonProps) {
    const { t } = useLanguage();

    const getShortName = (name: string) => {
        const parts = name.split('/').pop()?.split('.') ?? [];
        return parts.slice(0, -1).join('.') || name;
    };

    const codeA = info.details.diffs.filter(([op]) => op !== DIFF_INSERT).map(([, text]) => text).join('');
    const codeB = info.details.diffs.filter(([op]) => op !== DIFF_DELETE).map(([, text]) => text).join('');

    return (
        <div className="w-full flex flex-col gap-6">
            <div>
                <Button variant="ghost" onClick={onBack} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.backToAnalysis}
                </Button>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{t.detailedComparison}</h2>
                        <p className="text-muted-foreground text-lg">{getShortName(info.fileA)} -- {getShortName(info.fileB)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold text-red-500">{info.similarity.toFixed(1)}%</p>
                        <p className="text-muted-foreground">{t.overallSimilarity}</p>
                    </div>
                </div>
            </div>

            {info.similarity > 75 && (
                 <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4 !text-red-500" />
                    <AlertTitle className="text-red-700 font-bold">{t.warning}</AlertTitle>
                    <AlertDescription className="text-red-600">
                        {t.warningDetail}
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{t.detailedInfo}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <InfoCard title={t.similarToken} value={`${info.similarity.toFixed(2)}%`} />
                    <InfoCard title={t.commonString} value={info.details.commonStrings} />
                    <InfoCard title={t.tokensSV1} value={info.details.tokensA} />
                    <InfoCard title={t.tokensSV2} value={info.details.tokensB} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t.similarCode}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {info.details.similarSnippets.length > 0 ? info.details.similarSnippets.map((snippet, index) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <Badge variant="outline" className="mb-2 bg-white border-gray-300">{snippet.tokens} tokens</Badge>
                            <pre className="text-sm bg-transparent font-code overflow-x-auto"><code>{snippet.content}</code></pre>
                        </div>
                    )) : <p className="text-sm text-muted-foreground">{t.noSimilarSnippets}</p>}
                </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{getShortName(info.fileA)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CodeHighlighter diffs={info.details.diffs} view="A" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{getShortName(info.fileB)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CodeHighlighter diffs={info.details.diffs} view="B" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
