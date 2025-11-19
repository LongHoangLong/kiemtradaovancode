"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { AssignmentUpload } from "@/components/assignment-upload";
import { PlagiarismReport } from "@/components/plagiarism-report";
import { useLanguage } from "@/contexts/language-context";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyzePlagiarism } from "@/ai/flows/plagiarism-flow";
import { useToast } from "@/hooks/use-toast";
import { PlagiarismResult } from "@/ai/schema/plagiarism";


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

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      let fileDataUri = reader.result as string;

      // Normalize MIME type for zip files
      if (file.type === 'application/x-zip-compressed' && fileDataUri.startsWith('data:application/x-zip-compressed')) {
        fileDataUri = fileDataUri.replace('data:application/x-zip-compressed', 'data:application/zip');
      }
      
      // Simulate progress for user feedback during analysis
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : 90));
      }, 500);

      try {
        const plagiarismResults = await analyzePlagiarism({
          zipFileDataUri: fileDataUri,
        });

        clearInterval(progressInterval);
        setProgress(100);
        
        // Sort results by similarity descending
        const sortedResults = plagiarismResults.sort((a, b) => b.similarity - a.similarity);
        
        setResults(sortedResults.map((r, i) => ({...r, id: (i+1).toString()})));

      } catch (error) {
        console.error("Analysis failed:", error);
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "An unexpected error occurred during the analysis.",
        });
        clearInterval(progressInterval);
      } finally {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
      }
    };
    reader.onerror = () => {
      console.error("Failed to read file");
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "Could not read the selected file.",
      });
      setIsAnalyzing(false);
    };
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
