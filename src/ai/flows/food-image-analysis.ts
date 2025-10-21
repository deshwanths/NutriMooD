'use server';

/**
 * @fileOverview Analyzes a food image to identify the food items and provide a nutritional analysis.
 *
 * - analyzeFoodImage - A function that handles the food image analysis process.
 * - AnalyzeFoodImageInput - The input type for the analyzeFoodImage function.
 * - AnalyzeFoodImageOutput - The return type for the analyzeFoodImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFoodImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type AnalyzeFoodImageInput = z.infer<typeof AnalyzeFoodImageInputSchema>;

const AnalyzeFoodImageOutputSchema = z.object({
  foodItems: z
    .array(z.string())
    .describe('A list of identified food items in the image.'),
  calories: z.number().optional().describe('The total estimated calories.'),
  protein: z.number().optional().describe('The total protein in grams.'),
  carbs: z.number().optional().describe('The total carbohydrates in grams.'),
  fat: z.number().optional().describe('The total fat in grams.'),
  moodImpact: z
    .string()
    .optional()
    .describe(
      'A description of the likely effect of the food on the user’s mood.'
    ),
});
export type AnalyzeFoodImageOutput = z.infer<typeof AnalyzeFoodImageOutputSchema>;

export async function analyzeFoodImage(input: AnalyzeFoodImageInput): Promise<AnalyzeFoodImageOutput> {
  return analyzeFoodImageFlow(input);
}

const analyzeFoodImagePrompt = ai.definePrompt({
  name: 'analyzeFoodImagePrompt',
  input: {schema: AnalyzeFoodImageInputSchema},
  output: {schema: AnalyzeFoodImageOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing food images and providing nutritional information.

  Analyze the food in the image and identify the food items.  Also provide estimated calories, protein, carbs and fat.
  Analyze the probable impact on the users mood.

  Image: {{media url=photoDataUri}}
  `,
});

const analyzeFoodImageFlow = ai.defineFlow(
  {
    name: 'analyzeFoodImageFlow',
    inputSchema: AnalyzeFoodImageInputSchema,
    outputSchema: AnalyzeFoodImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeFoodImagePrompt(input);
    return output!;
  }
);

