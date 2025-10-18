import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-text.ts';
import '@/ai/flows/generate-text-from-prompt.ts';
import '@/ai/flows/generate-image-from-prompt.ts';