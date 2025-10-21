'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, HeartPulse, Loader2, Sparkles } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { analyzeFoodImageAction, getPersonalizedMoodImpactAction } from '@/app/actions';
import { StatCard } from './StatCard';
import { WeeklyChart } from './WeeklyChart';
import type { FoodAnalysis, PersonalizedMoodImpact } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function DashboardClient() {
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [personalizedImpact, setPersonalizedImpact] = useState<PersonalizedMoodImpact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mood, setMood] = useState(5);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setAnalysis(null);
        setPersonalizedImpact(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleScan = async () => {
    if (!preview) {
      toast({
        variant: 'destructive',
        title: 'No image selected',
        description: 'Please select an image of your food first.',
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);
    setPersonalizedImpact(null);
    try {
      const result = await analyzeFoodImageAction(preview);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not analyze the food image. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalize = async () => {
    if (!analysis) return;
    setIsPersonalizing(true);
    try {
      const nutritionDataString = `Calories: ${analysis.calories}, Protein: ${analysis.protein}g, Carbs: ${analysis.carbs}g, Fat: ${analysis.fat}g`;
      const result = await getPersonalizedMoodImpactAction({
        foodDescription: analysis.foodItems.join(', '),
        moodScore: mood,
        nutritionData: nutritionDataString,
      });
      setPersonalizedImpact(result);
      toast({
        title: 'Personalized Insight!',
        description: 'We\'ve analyzed your mood input.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Personalization Failed',
        description: 'Could not generate personalized insight. Please try again.',
      });
    } finally {
      setIsPersonalizing(false);
    }
  }

  const welcomeImage = PlaceHolderImages.find(p => p.id === 'welcome-image');

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Scan</CardTitle>
            <CardDescription>Upload a picture of your meal to get started.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted p-6">
              {preview ? (
                <Image
                  src={preview}
                  alt="Food preview"
                  width={300}
                  height={300}
                  className="max-h-64 w-auto rounded-lg object-contain"
                />
              ) : (
                <>
                  <Camera className="h-12 w-12 text-muted-foreground" />
                  <p className="text-center text-sm text-muted-foreground">Preview of your food will appear here.</p>
                </>
              )}
               <div className="w-full">
                <Input id="picture" type="file" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} className="hidden"/>
                <Button asChild className="w-full cursor-pointer">
                  <label htmlFor="picture">
                    <Camera className="mr-2 h-4 w-4" /> Choose Photo
                  </label>
                </Button>
               </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Our AI will analyze your meal to provide nutritional insights and its potential impact on your mood. Ready to see what's on your plate?
              </p>
              <Button onClick={handleScan} disabled={isLoading || !preview} size="lg">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Analyze Meal
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Analyzing your meal... our AI is a picky eater!</p>
            </CardContent>
          </Card>
        )}
        
        {analysis && (
          <Card className="animate-in fade-in-0 duration-500">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                We identified: <span className="font-semibold text-primary">{analysis.foodItems.join(', ')}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Calories" value={analysis.calories ?? 0} />
                <StatCard label="Protein" value={analysis.protein ?? 0} unit="g" />
                <StatCard label="Carbs" value={analysis.carbs ?? 0} unit="g" />
                <StatCard label="Fat" value={analysis.fat ?? 0} unit="g" />
              </div>
              <Card className="bg-background/50">
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  <div className="rounded-full bg-accent/20 p-2">
                    <HeartPulse className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-lg">General Mood Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{analysis.moodImpact}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personalize Your Insight</CardTitle>
                  <CardDescription>Tell us how you feel after this meal to get a more personalized analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mood-slider" className="text-center">Your Mood: {mood} / 10</Label>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl" aria-hidden="true">😞</span>
                      <Slider
                        id="mood-slider"
                        min={1}
                        max={10}
                        step={1}
                        value={[mood]}
                        onValueChange={(value) => setMood(value[0])}
                        aria-label="Mood slider"
                      />
                      <span className="text-2xl" aria-hidden="true">😄</span>
                    </div>
                  </div>
                   <Button onClick={handlePersonalize} disabled={isPersonalizing}>
                    {isPersonalizing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    Get Personalized Insight
                  </Button>
                  {personalizedImpact && (
                     <Card className="bg-background/50 animate-in fade-in-0 duration-500">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                          <div className="rounded-full bg-primary/20 p-2">
                             <Sparkles className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-lg">Personalized Mood Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{personalizedImpact.personalizedMoodImpact}</p>
                        </CardContent>
                      </Card>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Mood Trend</CardTitle>
            <CardDescription>A mock chart showing your mood over the last week.</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyChart />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Welcome to NutriMood!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {welcomeImage && (
                    <Image src={welcomeImage.imageUrl} alt={welcomeImage.description} width={400} height={250} className="w-full rounded-lg object-cover" data-ai-hint={welcomeImage.imageHint}/>
                )}
                <p className="text-sm text-muted-foreground">Your journey to understanding the link between your diet and your mood starts here. Snap a photo of your meal and let's get started!</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
