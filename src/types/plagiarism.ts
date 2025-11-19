
export type PlagiarismDetails = {
    codeA: string;
    codeB: string;
}

export type PlagiarismResult = {
    id: string;
    fileA: string;
    fileB: string;
    similarity: number;
    details: PlagiarismDetails;
};

export type DetailedComparisonInfo = PlagiarismResult;

export interface SimilarityMatrix {
    fileNames: string[];
    similarityMatrix: number[][];
}

export interface AnalysisResult {
    fileName: string;
    totalSubmissions: number;
    suspiciousPairs: number;
    totalComparisons: number;
    detailedList: PlagiarismResult[];
    matrix: SimilarityMatrix;
}
