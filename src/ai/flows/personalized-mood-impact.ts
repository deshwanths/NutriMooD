'use server';

/**
 * @fileOverview Calculates the personalized mood impact of food based on user-reported data and nutritional analysis.
 *
 * - calculatePersonalizedMoodImpact - A function that calculates personalized mood impact.
 * - PersonalizedMoodImpactInput - The input type for the calculatePersonalizedMoodImpact function.
 * - PersonalizedMoodImpactOutput - The return type for the calculatePersonalizedMoodImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedMoodImpactInputSchema = z.object({
  foodDescription: z
    .string()
    .describe('Description of the food consumed, e.g., a cheeseburger.'),
  moodScore: z.number().describe('User-reported mood score after consuming the food (e.g., 1-10).'),
  nutritionData: z.string().describe('Nutritional information about the food.'),
});

export type PersonalizedMoodImpactInput = z.infer<typeof PersonalizedMoodImpactInputSchema>;

const PersonalizedMoodImpactOutputSchema = z.object({
  personalizedMoodImpact: z
    .string()
    .describe('Explanation of the food impact on the user mood, based on both nutritional data and mood score.'),
});

export type PersonalizedMoodImpactOutput = z.infer<typeof PersonalizedMoodImpactOutputSchema>;

export async function calculatePersonalizedMoodImpact(
  input: PersonalizedMoodImpactInput
): Promise<PersonalizedMoodImpactOutput> {
  return personalizedMoodImpactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedMoodImpactPrompt',
  input: {schema: PersonalizedMoodImpactInputSchema},
  output: {schema: PersonalizedMoodImpactOutputSchema},
  prompt: `You are an AI assistant that analyzes the relationship between food and mood.

You will receive a description of the food consumed, its nutritional data, and the user\'s self-reported mood score after eating the food.

Based on this information, determine the personalized mood impact of the food on the user, combining nutritional analysis with the user\'s subjective experience.

Food Description: {{{foodDescription}}}
Mood Score: {{{moodScore}}}
Nutrition Data: {{{nutritionData}}}

Explain how the food likely affected the user\'s mood, considering both the nutritional content and the user-reported mood score.
`,
});

const personalizedMoodImpactFlow = ai.defineFlow(
  {
    name: 'personalizedMoodImpactFlow',
    inputSchema: PersonalizedMoodImpactInputSchema,
    outputSchema: PersonalizedMoodImpactOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
