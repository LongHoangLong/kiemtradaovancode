
"use client";

import { useLanguage } from "@/contexts/language-context";
import { AnalysisResult } from "@/types/plagiarism";
import { Button } from "./ui/button";
import { ArrowLeft, File, AlertTriangle, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { SimilarityMatrix } from "./similarity-matrix";
import { DetailedList } from "./plagiarism-report";

interface AnalysisReportProps {
    result: AnalysisResult;
    onReset: () => void;
}

const StatCard = ({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: number, color?: string }) => (
    <Card className="shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-opacity-20 ${color ? `bg-${color}-500 text-${color}-600` : 'bg-primary text-primary'}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{title}</p>
            </div>
        </CardContent>
    </Card>
);

export function AnalysisReport({ result, onReset }: AnalysisReportProps) {
    const { t } = useLanguage();

    return (
        <div className="w-full flex flex-col gap-6">
            <div>
                <Button variant="ghost" onClick={onReset} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.back}
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">{result.fileName}</h2>
                <p className="text-muted-foreground text-sm">{new Date().toLocaleString()}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={<File className="h-6 w-6"/>} title={t.totalSubmissions} value={result.totalSubmissions} color="blue"/>
                <StatCard icon={<AlertTriangle className="h-6 w-6"/>} title={t.suspiciousPairs} value={result.suspiciousPairs} color="red"/>
                <StatCard icon={<Target className="h-6 w-6"/>} title={t.totalComparisons} value={result.totalComparisons} color="green"/>
            </div>

            <Tabs defaultValue="matrix" className="w-full">
                <TabsList>
                    <TabsTrigger value="matrix">{t.similarityMatrix}</TabsTrigger>
                    <TabsTrigger value="list">{t.detailedList}</TabsTrigger>
                </TabsList>
                <TabsContent value="matrix" className="mt-4">
                    <SimilarityMatrix matrix={result.matrix} />
                </TabsContent>
                <TabsContent value="list" className="mt-4">
                    <DetailedList results={result.detailedList} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
