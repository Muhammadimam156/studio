
'use server';

import { generateTextFromPrompt } from '@/ai/flows/generate-text-from-prompt';
import { generateStartupIdeas } from '@/ai/flows/generate-startup-ideas';

/**
 * Server Action to handle general text generation.
 */
export async function handleTextGeneration(prompt: string) {
  if (!prompt) {
    return { success: false, error: 'Prompt cannot be empty.' };
  }
  try {
    const result = await generateTextFromPrompt({ prompt });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Text Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `AI service error: ${errorMessage}` };
  }
}

/**
 * Server Action to handle startup idea generation.
 */
export async function handleStartupIdeaGeneration(prompt: string) {
  if (!prompt) {
    return { success: false, error: 'Prompt cannot be empty.' };
  }
  try {
    const result = await generateStartupIdeas({ prompt });
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Startup Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `AI service error: ${errorMessage}` };
  }
}
