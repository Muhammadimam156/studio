'use server';
/**
 * @fileOverview A personal AI startup partner.
 *
 * - generateStartupIdeas - A function that handles the startup idea generation process.
 * - GenerateStartupIdeasInput - The input type for the generateStartupIdeas function.
 * - GenerateStartupIdeasOutput - The return type for the generateStartupIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStartupIdeasInputSchema = z.object({
  prompt: z.string().describe('The user\'s startup idea or concept.'),
});
export type GenerateStartupIdeasInput = z.infer<typeof GenerateStartupIdeasInputSchema>;

const GenerateStartupIdeasOutputSchema = z.object({
  startupName: z.string().describe('A creative and catchy name for the startup.'),
  tagline: z.string().describe('A short and memorable tagline for the startup.'),
  pitch: z.string().describe('A concise elevator pitch for the startup.'),
  problemStatement: z.string().describe('A clear statement of the problem the startup solves.'),
  solutionStatement: z.string().describe('A clear statement of how the startup solves the problem.'),
  targetAudience: z.string().describe('A definition of the primary target audience.'),
  uniqueValueProposition: z.string().describe('What makes the startup unique and valuable.'),
  heroCopy: z.string().describe('Compelling copy for a website hero section.'),
  colorPalette: z.array(z.string()).describe('A list of suggested hex color codes for branding.'),
  logoConcept: z.string().describe('A concept idea for the startup\'s logo.'),
});
export type GenerateStartupIdeasOutput = z.infer<typeof GenerateStartupIdeasOutputSchema>;

export async function generateStartupIdeas(
  input: GenerateStartupIdeasInput
): Promise<GenerateStartupIdeasOutput> {
  return generateStartupIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStartupIdeasPrompt',
  input: {schema: GenerateStartupIdeasInputSchema},
  output: {schema: GenerateStartupIdeasOutputSchema},
  prompt: `You are an expert startup consultant and branding specialist. A user will provide you with a startup idea, and your task is to generate a comprehensive branding and strategy package for them.

Based on the user's input: "{{prompt}}", please generate the following:

1.  **Startup Name:** A creative, memorable, and available-sounding name.
2.  **Tagline:** A catchy and concise tagline that encapsulates the brand's essence.
3.  **Elevator Pitch:** A compelling, 1-2 sentence pitch.
4.  **Problem Statement:** A clear and concise description of the problem the startup is solving.
5.  **Solution Statement:** A clear and concise description of how the startup solves that problem.
6.  **Target Audience:** A specific description of the ideal customer profile.
7.  **Unique Value Proposition (UVP):** What makes this startup different from and better than competitors.
8.  **Website Hero Section Copy:** Engaging and persuasive copy for the hero section of a landing page.
9.  **Color Palette:** A primary color, a secondary color, and an accent color in hex format.
10. **Logo Concept:** A simple, creative, and descriptive concept for a logo.

Please provide a well-thought-out and creative response for each of these categories.`,
});

const generateStartupIdeasFlow = ai.defineFlow(
  {
    name: 'generateStartupIdeasFlow',
    inputSchema: GenerateStartupIdeasInputSchema,
    outputSchema: GenerateStartupIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
