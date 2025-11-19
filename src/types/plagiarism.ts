
import type { diff_match_patch } from "diff-match-patch";

export type SimilarSnippet = {
    content: string;
    tokens: number;
};

export type PlagiarismDetails = {
    commonStrings: number;
    tokensA: number;
    tokensB: number;
    similarSnippets: SimilarSnippet[];
    diffs: ReturnType<diff_match_patch['diff_main']>;
    commonTokens: string[];
}

export type PlagiarismResult = {
    id: string;
    fileA: string;
    fileB: string;
    similarity: number;
    codeA: string;
    codeB: string;
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
