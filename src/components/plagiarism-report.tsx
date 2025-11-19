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

export interface PlagiarismResult {
  id: string;
  fileA: string;
  fileB: string;
  similarity: number;
}

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

  const codeExample1 = `// Mock code for student_1.cs

public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        Dictionary<int, int> map = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];
            if (map.ContainsKey(complement)) {
                return new int[] { map[complement], i };
            }
            map[nums[i]] = i;
        }
        throw new ArgumentException("No two sum solution");
    }
}`;

  const codeExample2 = `// Mock code for student_2.cs
// Variable names have been changed.

public class Answer {
    public int[] FindTwoSum(int[] numbers, int goal) {
        var numberMap = new Dictionary<int, int>();
        for (var index = 0; index < numbers.Length; index++) {
            var needed = goal - numbers[index];
            if (numberMap.ContainsKey(needed)) {
                return new int[] { numberMap[needed], index };
            }
            numberMap[numbers[index]] = index;
        }
        throw new Exception("No solution found");
    }
}`;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>{t.reportTitle}</CardTitle>
      </CardHeader>
      <CardContent>
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
                              <pre className="text-xs bg-muted p-3 rounded-md font-code"><code>{codeExample1}</code></pre>
                            </CardContent>
                          </Card>
                          <Card className="flex flex-col h-full">
                            <CardHeader>
                              <CardTitle className="text-base truncate">{t.codeB} {result.fileB}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-auto">
                              <pre className="text-xs bg-muted p-3 rounded-md font-code"><code className="text-destructive">{codeExample2}</code></pre>
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
      </CardContent>
    </Card>
  );
}
