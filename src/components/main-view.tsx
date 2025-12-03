
"use client";

import { useLanguage } from "@/contexts/language-context";
import { AssignmentUpload } from "@/components/assignment-upload";
import { HistoryList } from "@/components/history-list";
import { AnalysisResult } from "@/types/plagiarism";

interface MainViewProps {
    onFileChange: (file: File | null) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
    fileName: string | undefined;
    history: AnalysisResult[];
    onViewHistory: (result: AnalysisResult) => void;
    onClearHistory: () => void;
    onDeleteHistoryItem: (id: string) => void;
}

export function MainView({
    onFileChange,
    onAnalyze,
    isAnalyzing,
    fileName,
    history,
    onViewHistory,
    onClearHistory,
    onDeleteHistoryItem,
}: MainViewProps) {
    const { t } = useLanguage();

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                {t.appName}
                </h2>
                <p className="text-lg text-muted-foreground">{t.tagline}</p>
            </div>
            <AssignmentUpload
                onFileChange={onFileChange}
                onAnalyze={onAnalyze}
                isAnalyzing={isAnalyzing}
                fileName={fileName}
            />
            <HistoryList 
              history={history}
              onView={onViewHistory}
              onClear={onClearHistory}
              onDeleteItem={onDeleteHistoryItem}
            />
        </div>
    );
}
