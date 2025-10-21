import type { AnalyzeFoodImageOutput } from '@/ai/flows/food-image-analysis';
import type {
  PersonalizedMoodImpactInput as GenkitMoodInput,
  PersonalizedMoodImpactOutput,
} from '@/ai/flows/personalized-mood-impact';

export type FoodAnalysis = AnalyzeFoodImageOutput;
export type PersonalizedMoodImpact = PersonalizedMoodImpactOutput;
export type PersonalizedMoodImpactInput = GenkitMoodInput;

export type WeeklyLog = {
  day: string;
  nutritionScore: number; // 1 (Bad), 2 (Neutral), 3 (Good)
  moodTrend: number; // 1 (Bad), 2 (Neutral), 3 (Good)
};
