
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/language-context";
import { Eye } from "lucide-react";
import { PlagiarismResult, DetailedComparisonInfo } from "@/types/plagiarism";
import { Card, CardContent } from "./ui/card";

interface DetailedListProps {
  results: PlagiarismResult[];
  onShowDetail: (info: DetailedComparisonInfo) => void;
}

export function DetailedList({ results, onShowDetail }: DetailedListProps) {
  const { t } = useLanguage();

  const getProgressColor = (similarity: number) => {
    if (similarity > 75) return "bg-destructive";
    if (similarity > 50) return "bg-orange-500";
    return "bg-green-500";
  };
  
  return (
    <Card className="w-full shadow-lg">
      <CardContent className="pt-6">
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
                        <span className={`font-semibold ${result.similarity > 75 ? 'text-destructive' : result.similarity > 50 ? 'text-orange-500' : 'text-green-600'}`}>{result.similarity.toFixed(1)}%</span>
                        <Progress value={result.similarity} indicatorClassName={getProgressColor(result.similarity)} className="h-2 w-full max-w-[150px]" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => onShowDetail(result)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t.viewDetails}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t.noSignificantPlagiarism}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
