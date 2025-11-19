
export type PlagiarismResult = {
    id: string;
    fileA: string;
    fileB: string;
    similarity: number;
    codeA: string;
    codeB: string;
};
