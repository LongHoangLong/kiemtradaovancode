"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/language-context";
import { Eye } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { PlagiarismResult } from "@/ai/schema/plagiarism";

interface PlagiarismReportProps {
  results: PlagiarismResult[];
}

export function PlagiarismReport({ results }: PlagiarismReportProps) {
  const { t } = useLanguage();

  const getProgressColor = (similarity: number) => {
    if (similarity > 75) return "bg-destructive";
    if (similarity > 50) return "bg-accent";
    return "bg-primary";
  };
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>{t.reportTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {results.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5">{t.filePair}</TableHead>
                  <TableHead className="text-center">{t.similarity}</TableHead>
                  <TableHead className="text-right">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="font-medium text-foreground truncate">{result.fileA}</div>
                      <div className="text-sm text-muted-foreground truncate">{result.fileB}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className={`font-semibold ${result.similarity > 75 ? 'text-destructive' : result.similarity > 50 ? 'text-accent-foreground' : 'text-foreground'}`}>{result.similarity.toFixed(1)}%</span>
                        <Progress value={result.similarity} indicatorClassName={getProgressColor(result.similarity)} className="h-2 w-full max-w-[150px]" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            {t.viewDetails}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                          <DialogHeader>
                            <DialogTitle>{t.detailedReport}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
                            <Card className="flex flex-col h-full">
                              <CardHeader>
                                <CardTitle className="text-base truncate">{t.codeA} {result.fileA}</CardTitle>
                              </CardHeader>
                              <CardContent className="flex-1 overflow-auto">
                                <ScrollArea className="h-full">
                                  <pre className="text-xs bg-muted p-3 rounded-md font-code"><code>{result.codeA || 'Code not available.'}</code></pre>
                                </ScrollArea>
                              </CardContent>
                            </Card>
                            <Card className="flex flex-col h-full">
                              <CardHeader>
                                <CardTitle className="text-base truncate">{t.codeB} {result.fileB}</CardTitle>
                              </CardHeader>
                              <CardContent className="flex-1 overflow-auto">
                                <ScrollArea className="h-full">
                                  <pre className="text-xs bg-muted p-3 rounded-md font-code"><code className="text-destructive">{result.codeB || 'Code not available.'}</code></pre>
                                </ScrollArea>
                              </CardContent>
                            </Card>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No significant plagiarism detected or no files to compare.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
