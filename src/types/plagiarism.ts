
import type { diff_match_patch } from "diff-match-patch";

export type PlagiarismDetails = {
    tokensA: number;
    tokensB: number;
    diffs: ReturnType<diff_match_patch['diff_main']>;
}

export type PlagiarismResult = {
    id: string;
    fileA: string;
    fileB: string;
    similarity: number;
    codeA: string;
    codeB: string;
    cleanedCodeA: string;
    cleanedCodeB: string;
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
