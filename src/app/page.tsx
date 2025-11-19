
"use client";

import { useState } from "react";
import JSZip from "jszip";
import DiffMatchPatch from "diff-match-patch";
import { Header } from "@/components/layout/header";
import { AssignmentUpload } from "@/components/assignment-upload";
import { AnalysisReport } from "@/components/analysis-report";
import { useLanguage } from "@/contexts/language-context";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult, PlagiarismResult, DetailedComparisonInfo } from "@/types/plagiarism";
import { Button } from "@/components/ui/button";

const cleanCode = (code: string): string => {
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "") // remove comments
    .replace(/#.*$/gm, "") // remove python comments
    .replace(/^\s*[\r\n]/gm, "") // remove empty lines
    .trim();
};

const tokenize = (code: string): string[] => {
    // This regex is designed to capture programming language tokens more accurately.
    // It identifies: identifiers, numbers, strings, operators, and delimiters.
    const regex = /[a-zA-Z_]\w*|\d+(?:\.\d+)?|"[^"]*"|'[^']*'|==|!=|<=|>=|&&|\|\||>>|<<|\+\+|--|[-+*/%&|^~=<>!?:;,.(){}[\]]/g;
    const tokens = code.match(regex);
    return tokens || [];
}

// Function to create a frequency map of tokens
const createTokenMap = (tokens: string[]): Map<string, number> => {
  const map = new Map<string, number>();
  for (const token of tokens) {
    map.set(token, (map.get(token) || 0) + 1);
  }
  return map;
};

export default function Home() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [detailedViewInfo, setDetailedViewInfo] = useState<DetailedComparisonInfo | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setAnalysisComplete(false);
    setAnalysisResult(null);
    setDetailedViewInfo(null);
    setProgress(0);
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisComplete(false);
    setAnalysisResult(null);
    setDetailedViewInfo(null);
    setProgress(0);
  };

  const handleShowDetail = (info: DetailedComparisonInfo) => {
    setDetailedViewInfo(info);
  };
  
  const handleBackToReport = () => {
    setDetailedViewInfo(null);
  };

  const handleAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setDetailedViewInfo(null);
    setProgress(0);

    try {
      const zip = await JSZip.loadAsync(file);
      const files: { name: string; content: string }[] = [];

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
      const fileNames = files.map(f => f.name);
      const similarityMatrix: number[][] = Array(files.length).fill(0).map(() => Array(files.length).fill(0));

      for (let i = 0; i < files.length; i++) {
        for (let j = i + 1; j < files.length; j++) {
          const fileA = files[i];
          const fileB = files[j];
          
          const cleanedCodeA = cleanCode(fileA.content);
          const cleanedCodeB = cleanCode(fileB.content);
          
          // 1. Token-based similarity for accuracy
          const tokensA = tokenize(cleanedCodeA);
          const tokensB = tokenize(cleanedCodeB);
          
          const mapA = createTokenMap(tokensA);
          const mapB = createTokenMap(tokensB);

          let intersectionSize = 0;
          const allTokens = new Set([...mapA.keys(), ...mapB.keys()]);

          for (const token of allTokens) {
            const countA = mapA.get(token) || 0;
            const countB = mapB.get(token) || 0;
            if (countA > 0 && countB > 0) {
              intersectionSize += Math.min(countA, countB);
            }
          }
          
          const totalTokens = tokensA.length + tokensB.length;
          const similarity = totalTokens > 0 ? (2 * intersectionSize / totalTokens) * 100 : 0;
          
          similarityMatrix[i][j] = similarity;
          similarityMatrix[j][i] = similarity;
          
          // 2. Diff-based comparison for highlighting (using cleaned content for consistency)
          const diffs = dmp.diff_main(cleanedCodeA, cleanedCodeB);
          dmp.diff_cleanupSemantic(diffs);
          
          comparisons.push({
            id: `${i}-${j}`,
            fileA: fileA.name,
            fileB: fileB.name,
            similarity: similarity,
            codeA: fileA.content, // Keep original code for display
            codeB: fileB.content, // Keep original code for display
            cleanedCodeA: cleanedCodeA,
            cleanedCodeB: cleanedCodeB,
            details: {
                tokensA: tokensA.length,
                tokensB: tokensB.length,
                diffs: diffs,
            }
          });
          
          comparisonsDone++;
          setProgress(Math.round((comparisonsDone / totalComparisons) * 100));
        }
      }

      const sortedResults = comparisons.sort((a, b) => b.similarity - a.similarity).map((res, index) => ({...res, id: `${index}`}));
      
      const suspiciousPairs = sortedResults.filter(r => r.similarity > 75).length;

      setAnalysisResult({
        fileName: file.name,
        totalSubmissions: files.length,
        totalComparisons: totalComparisons,
        suspiciousPairs: suspiciousPairs,
        detailedList: sortedResults,
        matrix: {
            fileNames: fileNames,
            similarityMatrix: similarityMatrix,
        }
      });

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

  const currentView = () => {
    if(isAnalyzing) {
        return (
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
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
            </div>
        );
    }
    
    if (analysisComplete && analysisResult) {
      return (
        <AnalysisReport 
            result={analysisResult} 
            onReset={handleReset} 
            detailedViewInfo={detailedViewInfo}
            onShowDetail={handleShowDetail}
            onBackToReport={handleBackToReport}
        />
      );
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                {t.appName}
                </h2>
                <p className="text-lg text-muted-foreground">{t.tagline}</p>
            </div>
            <AssignmentUpload
                onFileChange={handleFileChange}
                onAnalyze={handleAnalysis}
                isAnalyzing={isAnalyzing}
                fileName={file?.name}
            />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {currentView()}
      </main>
      <footer className="py-4 px-6 md:px-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {t.appName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
