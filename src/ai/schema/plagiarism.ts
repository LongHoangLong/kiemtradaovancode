/**
 * @fileOverview Schemas and types for the plagiarism analysis flow.
 */
import { z } from 'genkit';

export const PlagiarismInputSchema = z.object({
  zipFileDataUri: z
    .string()
    .describe(
      "A zip file containing code submissions, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PlagiarismInput = z.infer<typeof PlagiarismInputSchema>;

const PlagiarismResultSchema = z.object({
  fileA: z.string().describe('The name of the first file in the pair.'),
  fileB: z.string().describe('The name of the second file in the pair.'),
  similarity: z.number().describe('The similarity score between 0 and 100.'),
  codeA: z.string().describe('The content of the first file.'),
  codeB: z.string().describe('The content of the second file.'),
});

export const PlagiarismOutputSchema = z.array(PlagiarismResultSchema);

// This type is used on the client, so we augment the server-side schema result
export type PlagiarismResult = z.infer<typeof PlagiarismResultSchema> & {
    id: string;
};
