
"use client";

import { useState } from "react";
import JSZip from "jszip";
import DiffMatchPatch from "diff-match-patch";
import { Header } from "@/components/layout/header";
import { AssignmentUpload } from "@/components/assignment-upload";
import { PlagiarismReport } from "@/components/plagiarism-report";
import { useLanguage } from "@/contexts/language-context";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PlagiarismResult } from "@/types/plagiarism";

// A simple text cleaner to remove comments, newlines, and extra spaces
const cleanCode = (code: string): string => {
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "") // remove comments
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
};

export default function Home() {
  const { t } = useLanguage();
  const { toast } = useToast();
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

  const handleAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setProgress(0);

    try {
      const zip = await JSZip.loadAsync(file);
      const files: { name: string; content: string }[] = [];

      // Extract all files from the zip
      for (const filename in zip.files) {
        if (!zip.files[filename].dir) {
          const content = await zip.files[filename].async("string");
          files.push({ name: filename, content });
        }
      }

      if (files.length < 2) {
        toast({
          variant: "destructive",
          title: "Not enough files",
          description: "The zip file must contain at least two files to compare.",
        });
        setIsAnalyzing(false);
        return;
      }

      const comparisons: PlagiarismResult[] = [];
      const dmp = new DiffMatchPatch();
      const totalComparisons = (files.length * (files.length - 1)) / 2;
      let comparisonsDone = 0;

      // Compare each pair of files
      for (let i = 0; i < files.length; i++) {
        for (let j = i + 1; j < files.length; j++) {
          const fileA = files[i];
          const fileB = files[j];
          
          const cleanA = cleanCode(fileA.content);
          const cleanB = cleanCode(fileB.content);

          const diffs = dmp.diff_main(cleanA, cleanB);
          dmp.diff_cleanupSemantic(diffs);
          
          const distance = dmp.diff_levenshtein(diffs);
          const longerTextLength = Math.max(cleanA.length, cleanB.length);
          const similarity = (1 - distance / longerTextLength) * 100;
          
          if (similarity > 10) { // Only show significant similarities
            comparisons.push({
              id: `${i}-${j}`,
              fileA: fileA.name,
              fileB: fileB.name,
              similarity: similarity,
              codeA: fileA.content,
              codeB: fileB.content,
            });
          }
          
          comparisonsDone++;
          setProgress(Math.round((comparisonsDone / totalComparisons) * 100));
        }
      }

      // Sort results by similarity descending
      const sortedResults = comparisons.sort((a, b) => b.similarity - a.similarity);
      
      setResults(sortedResults.slice(0, 10)); // Limit to top 10 results

    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An unexpected error occurred during the analysis. The file might be corrupted.",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setProgress(100);
    }
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
