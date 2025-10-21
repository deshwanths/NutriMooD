'use server';

/**
 * @fileOverview Calculates the nutritional content of a food item.
 *
 * - analyzeFood - A function that handles the nutritional analysis of a food item.
 * - NutritionalAnalysisInput - The input type for the analyzeFood function.
 * - NutritionalAnalysisOutput - The return type for the analyzeFood function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionalAnalysisInputSchema = z.object({
  foodName: z.string().describe('The name of the food item to analyze.'),
});
export type NutritionalAnalysisInput = z.infer<typeof NutritionalAnalysisInputSchema>;

const NutritionalAnalysisOutputSchema = z.object({
  calories: z.number().describe('The total calories in the food item.'),
  protein: z.number().describe('The amount of protein in grams.'),
  carbs: z.number().describe('The amount of carbohydrates in grams.'),
  fat: z.number().describe('The amount of fat in grams.'),
  micronutrients: z
    .record(z.string(), z.string())
    .describe('A record of micronutrients, where the key is the name of the nutrient and the value is the amount, including units.'),
});
export type NutritionalAnalysisOutput = z.infer<typeof NutritionalAnalysisOutputSchema>;

export async function analyzeFood(input: NutritionalAnalysisInput): Promise<NutritionalAnalysisOutput> {
  return analyzeFoodFlow(input);
}

const prompt = ai.definePrompt({
  name: 'nutritionalAnalysisPrompt',
  input: {schema: NutritionalAnalysisInputSchema},
  output: {schema: NutritionalAnalysisOutputSchema},
  prompt: `You are an expert nutritionist. Given the name of a food item, you will provide a detailed nutritional analysis, including calories, macronutrients (protein, carbs, fat), and micronutrients (vitamins and minerals if available).

  Food Item: {{{foodName}}}

  Provide the analysis in JSON format, strictly adhering to the output schema.  Ensure all numeric values are numbers, not strings.
  `,
});

const analyzeFoodFlow = ai.defineFlow(
  {
    name: 'analyzeFoodFlow',
    inputSchema: NutritionalAnalysisInputSchema,
    outputSchema: NutritionalAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
