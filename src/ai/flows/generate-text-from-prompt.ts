'use server';

/**
 * @fileOverview A text generation AI agent.
 *
 * - generateTextFromPrompt - A function that handles the text generation process.
 * - GenerateTextFromPromptInput - The input type for the generateTextFromPrompt function.
 * - GenerateTextFromPromptOutput - The return type for the generateTextFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTextFromPromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to generate text from.'),
});

export type GenerateTextFromPromptInput = z.infer<
  typeof GenerateTextFromPromptInputSchema
>;

const GenerateTextFromPromptOutputSchema = z.object({
  text: z.string().describe('The generated text.'),
});

export type GenerateTextFromPromptOutput = z.infer<
  typeof GenerateTextFromPromptOutputSchema
>;

export async function generateTextFromPrompt(
  input: GenerateTextFromPromptInput
): Promise<GenerateTextFromPromptOutput> {
  return generateTextFromPromptFlow(input);
}

const generateTextPrompt = ai.definePrompt({
  name: 'generateTextPrompt',
  input: {schema: GenerateTextFromPromptInputSchema},
  output: {schema: GenerateTextFromPromptOutputSchema},
  prompt: `Generate text from the following prompt: {{{prompt}}}`,
});

const generateTextFromPromptFlow = ai.defineFlow(
  {
    name: 'generateTextFromPromptFlow',
    inputSchema: GenerateTextFromPromptInputSchema,
    outputSchema: GenerateTextFromPromptOutputSchema,
  },
  async input => {
    const {output} = await generateTextPrompt(input);
    return output!;
  }
);
