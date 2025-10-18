
'use server';

import { generateTextFromPrompt } from '@/ai/flows/generate-text-from-prompt';
import { generateImageFromPrompt } from '@/ai/flows/generate-image-from-prompt';
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
    return { success: false, error: 'Failed to generate text. Please try again later.' };
  }
}

export async function handleImageGeneration(prompt: string) {
  if (!prompt) {
    return { success: false, error: 'Prompt cannot be empty.' };
  }
  try {
    const result = await generateImageFromPrompt({ promptText: prompt });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate image. Please try again later.' };
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
    return { success: false, error: 'Failed to generate startup ideas. Please try again later.' };
  }
}
