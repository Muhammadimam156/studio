
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  // Switching to gemini-1.5-pro as it is often more broadly available 
  // and might resolve the 404 issue encountered with the flash model.
  model: 'googleai/gemini-1.5-pro',
});
