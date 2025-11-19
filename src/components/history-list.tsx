
"use client";

import { useLanguage } from "@/contexts/language-context";
import { AnalysisResult } from "@/types/plagiarism";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { History, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryListProps {
  history: AnalysisResult[];
  onView: (result: AnalysisResult) => void;
  onClear: () => void;
}

export function HistoryList({ history, onView, onClear }: HistoryListProps) {
  const { t } = useLanguage();

  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl shadow-lg mt-8">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-6 w-6" />
                    {t.history}
                </CardTitle>
                <CardDescription>{t.noHistory}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClear} disabled={history.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t.clearHistory}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.fileName}</TableHead>
                <TableHead>{t.date}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.fileName}</TableCell>
                  <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => onView(item)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t.viewReport}
                    </Button>
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

    