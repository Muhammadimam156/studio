
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY,
    }),
  ],
  // Use the standard model identifier for the Flash model.
  // If 'googleai/gemini-1.5-flash' still results in a 404, it may be due to regional restrictions 
  // or API key permissions on that specific model resource.
  model: 'googleai/gemini-1.5-flash',
});
