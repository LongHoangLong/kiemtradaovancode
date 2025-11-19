
"use client";

import { useLanguage } from "@/contexts/language-context";
import { SimilarityMatrix as SimilarityMatrixType } from "@/types/plagiarism";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface SimilarityMatrixProps {
  matrix: SimilarityMatrixType;
  onCellClick: (fileAIndex: number, fileBIndex: number) => void;
}

export function SimilarityMatrix({ matrix, onCellClick }: SimilarityMatrixProps) {
  const { t } = useLanguage();
  const { fileNames, similarityMatrix } = matrix;

  const getShortName = (name: string) => {
    const parts = name.split('/').pop()?.split('.') ?? [];
    return parts.slice(0, -1).join('.') || name;
  };
  
  const shortFileNames = fileNames.map(getShortName);

  const getBadgeColor = (similarity: number) => {
    if (similarity > 75) return "bg-red-500 hover:bg-red-600";
    if (similarity > 50) return "bg-orange-400 hover:bg-orange-500";
    if (similarity > 25) return "bg-yellow-400 hover:bg-yellow-500 text-black";
    return "bg-green-500 hover:bg-green-600";
  };

  return (
    <Card className="w-full shadow-lg overflow-x-auto">
      <CardHeader>
        <CardTitle>{t.similarityMatrixDesc}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b border-r text-sm font-medium text-muted-foreground text-left sticky left-0 bg-card z-10">{t.student}</th>
                {shortFileNames.map((name, index) => (
                  <th key={index} className="p-2 border-b text-sm font-medium text-muted-foreground -rotate-45 h-24 w-10 origin-bottom-left">
                     <div className="whitespace-nowrap translate-x-4 -translate-y-1/2">
                        {name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shortFileNames.map((rowName, i) => (
                <tr key={i}>
                  <td className="p-2 border-b border-r font-medium text-sm text-foreground sticky left-0 bg-card z-10 whitespace-nowrap">{rowName}</td>
                  {shortFileNames.map((colName, j) => (
                    <td key={j} className="p-2 border-b text-center">
                      {i === j ? (
                        <div className="bg-muted h-9 w-full rounded-md flex items-center justify-center">-</div>
                      ) : (
                        <Button 
                            variant="ghost" 
                            className={`h-auto w-auto p-0 ${getBadgeColor(similarityMatrix[i][j])} text-white text-xs font-semibold`}
                            onClick={() => onCellClick(i,j)}
                        >
                            <Badge className={`pointer-events-none ${getBadgeColor(similarityMatrix[i][j])}`}>
                                {similarityMatrix[i][j].toFixed(1)}%
                            </Badge>
                        </Button>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
