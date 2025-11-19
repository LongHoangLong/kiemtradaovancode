'use server';
/**
 * @fileOverview A plagiarism analysis AI flow.
 *
 * - analyzePlagiarism: A function that handles the plagiarism analysis of a zip file.
 */

import { ai } from '@/ai/genkit';
import {
  PlagiarismInputSchema,
  PlagiarismOutputSchema,
  type PlagiarismInput,
  type PlagiarismResult,
} from '@/ai/schema/plagiarism';

export async function analyzePlagiarism(input: PlagiarismInput): Promise<PlagiarismResult[]> {
  const results = await plagiarismAnalysisFlow(input);
  // Augment with a unique ID for React keys, though this might be better done client-side.
  return results.map((result, index) => ({
    ...result,
    id: `${index + 1}`
  }));
}

const prompt = ai.definePrompt({
  name: 'plagiarismPrompt',
  input: { schema: PlagiarismInputSchema },
  output: { schema: PlagiarismOutputSchema },
  prompt: `You are a code plagiarism detection expert. Your task is to analyze a provided zip file containing multiple code submissions.

  You must perform the following steps:
  1.  Unpack the zip file which is provided as a data URI.
  2.  Identify all pairs of files to compare. You should compare all files with each other.
  3.  For each pair, calculate a similarity score from 0 to 100, where 100 is identical.
  4.  Consider various factors for similarity, including but not limited to:
      -   Direct copy-pasting of code blocks.
      -   Renaming variables, functions, or classes.
      -   Changing comments or formatting.
      -   Reordering of functions or statements if it doesn't change the logic.
      -   Minor logic variations that achieve the same result.
  5.  For each pair of files with a similarity score greater than 10%, you must return an object containing the names of the two files, their content, and the calculated similarity score.
  6.  Return an array of these objects, with no more than 10 results, sorted by similarity in descending order.

  Analyze the following zip file: {{media url=zipFileDataUri}}`,
});

const plagiarismAnalysisFlow = ai.defineFlow(
  {
    name: 'plagiarismAnalysisFlow',
    inputSchema: PlagiarismInputSchema,
    outputSchema: PlagiarismOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output ?? [];
  }
);
