
"use client";

import { useLanguage } from "@/contexts/language-context";
import { AnalysisResult } from "@/types/plagiarism";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface HistoryListProps {
  history: AnalysisResult[];
  onView: (result: AnalysisResult) => void;
  onClear: () => void;
  onDeleteItem: (id: string) => void;
}

export function HistoryList({ history, onView, onClear, onDeleteItem }: HistoryListProps) {
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
            <CardDescription>{t.historyDescription}</CardDescription>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={history.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                {t.clearHistory}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.clearHistoryConfirmTitle}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.clearHistoryConfirmDescription}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={onClear}>{t.confirm}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
        <TooltipProvider>
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
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onView(item)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t.viewReport}
                    </Button>
                    <AlertDialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t.delete}</p>
                        </TooltipContent>
                      </Tooltip>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t.clearHistoryConfirmTitle}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t.clearHistoryConfirmDescriptionSingle}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteItem(item.id)}>{t.confirm}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
