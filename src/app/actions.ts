'use server';

import { analyzeFoodImage } from '@/ai/flows/food-image-analysis';
import { calculatePersonalizedMoodImpact } from '@/ai/flows/personalized-mood-impact';
import type { FoodAnalysis, PersonalizedMoodImpact, PersonalizedMoodImpactInput } from '@/lib/types';

export async function analyzeFoodImageAction(photoDataUri: string): Promise<FoodAnalysis> {
  // Add a delay to simulate a real network request and show loading states
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const result = await analyzeFoodImage({ photoDataUri });

  if (!result) {
    throw new Error('Image analysis returned no result.');
  }

  return result;
}

export async function getPersonalizedMoodImpactAction(input: PersonalizedMoodImpactInput): Promise<PersonalizedMoodImpact> {
  // Add a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const result = await calculatePersonalizedMoodImpact(input);

  if (!result) {
    throw new Error('Personalized mood impact analysis returned no result.');
  }

  return result;
}
