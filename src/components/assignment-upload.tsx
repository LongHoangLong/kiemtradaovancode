"use client";

import { useState, DragEvent } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, File, X } from "lucide-react";

interface AssignmentUploadProps {
  onFileChange: (file: File | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  fileName: string | undefined;
}

export function AssignmentUpload({ onFileChange, onAnalyze, isAnalyzing, fileName }: AssignmentUploadProps) {
  const { t } = useLanguage();
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed' || file.name.endsWith('.rar')) {
        onFileChange(file);
      } else {
        onFileChange(null);
      }
    }
  };

  const handleDrag = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFileChange(null);
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle>{t.uploadTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <label
          htmlFor="dropzone-file"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`w-full p-10 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-center transition-colors
          ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
        >
          <input id="dropzone-file" type="file" className="hidden" accept=".zip,.rar" onChange={(e) => handleFileSelect(e.target.files)} />
          {fileName ? (
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3 bg-secondary py-2 px-4 rounded-lg">
                    <File className="h-6 w-6 text-primary" />
                    <span className="font-medium text-foreground">{fileName}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={removeFile}>
                        <X className="h-4 w-4"/>
                        <span className="sr-only">Remove file</span>
                    </Button>
                </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground pointer-events-none">
              <UploadCloud className="h-12 w-12" />
              <p className="font-semibold">{t.uploadSubtitle}</p>
              <p className="text-xs">(.zip, .rar)</p>
            </div>
          )}
        </label>
        <Button onClick={onAnalyze} disabled={!fileName || isAnalyzing} size="lg" className="w-full sm:w-auto">
          {t.uploadButton}
        </Button>
      </CardContent>
    </Card>
  );
}
