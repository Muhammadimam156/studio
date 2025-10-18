
'use server';

import { generateTextFromPrompt } from '@/ai/flows/generate-text-from-prompt';
import { generateStartupIdeas } from '@/ai/flows/generate-startup-ideas';

export async function handleTextGeneration(prompt: string) {
  if (!prompt) {
    return { success: false, error: 'Prompt cannot be empty.' };
  }
  try {
    const result = await generateTextFromPrompt({ prompt });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to generate text. ${errorMessage}` };
  }
}

export async function handleStartupIdeaGeneration(prompt: string) {
  if (!prompt) {
    return { success: false, error: 'Prompt cannot be empty.' };
  }
  try {
    const result = await generateStartupIdeas({ prompt });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return { success: false, error: `Failed to generate startup ideas. ${errorMessage}` };
  }
}
