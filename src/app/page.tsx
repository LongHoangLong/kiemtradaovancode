"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { AssignmentUpload } from "@/components/assignment-upload";
import {
  PlagiarismReport,
  type PlagiarismResult,
} from "@/components/plagiarism-report";
import { useLanguage } from "@/contexts/language-context";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [results, setResults] = useState<PlagiarismResult[]>([]);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setAnalysisComplete(false);
    setResults([]);
    setProgress(0);
  };

  const handleAnalysis = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return prev;
        }
        return prev + 5;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setResults([
        {
          id: "1",
          fileA: "student1_submission.py",
          fileB: "student12_submission.py",
          similarity: 92.5,
        },
        {
          id: "2",
          fileA: "student3_submission.cs",
          fileB: "student8_submission.cs",
          similarity: 78.2,
        },
        {
          id: "3",
          fileA: "student5_submission.py",
          fileB: "student6_submission.py",
          similarity: 65.0,
        },
        {
          id: "4",
          fileA: "student2_submission.py",
          fileB: "student9_submission.py",
          similarity: 45.7,
        },
        {
          id: "5",
          fileA: "student4_submission.cs",
          fileB: "student11_submission.cs",
          similarity: 12.3,
        },
      ]);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 5000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              {t.appName}
            </h2>
            <p className="text-lg text-muted-foreground">{t.tagline}</p>
          </div>

          {!analysisComplete && (
            <AssignmentUpload
              onFileChange={handleFileChange}
              onAnalyze={handleAnalysis}
              isAnalyzing={isAnalyzing}
              fileName={file?.name}
            />
          )}

          {isAnalyzing && (
            <Card className="w-full max-w-md shadow-md">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <h3 className="text-lg font-semibold">{t.analyzing}</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {t.analyzingDetail}
                </p>
                <Progress value={progress} className="w-full" />
              </CardContent>
            </Card>
          )}

          {analysisComplete && file && (
            <div className="w-full flex flex-col gap-8 items-center">
               <div className="text-center">
                <h3 className="text-2xl font-bold">{t.analysisComplete}</h3>
                <p className="text-muted-foreground">{t.reportFor} <span className="font-semibold text-primary">{file.name}</span></p>
                <Button variant="link" onClick={() => {
                  setFile(null);
                  setAnalysisComplete(false);
                }}>
                  Start a new analysis
                </Button>
               </div>
              <PlagiarismReport results={results} />
            </div>
          )}
        </div>
      </main>
      <footer className="py-4 px-6 md:px-8 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {t.appName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
