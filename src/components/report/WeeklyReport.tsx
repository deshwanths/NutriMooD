import type { WeeklyLog } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockWeeklyData: WeeklyLog[] = [
  { day: 'Monday', nutritionScore: 3, moodTrend: 3 },
  { day: 'Tuesday', nutritionScore: 1, moodTrend: 1 },
  { day: 'Wednesday', nutritionScore: 2, moodTrend: 2 },
  { day: 'Thursday', nutritionScore: 3, moodTrend: 2 },
  { day: 'Friday', nutritionScore: 3, moodTrend: 3 },
  { day: 'Saturday', nutritionScore: 1, moodTrend: 2 },
  { day: 'Sunday', nutritionScore: 2, moodTrend: 3 },
];

const scoreToEmoji = (type: 'nutrition' | 'mood', score: number): string => {
  if (type === 'nutrition') {
    if (score === 3) return '✅';
    if (score === 2) return '⚠️';
    return '❌';
  } else { // mood
    if (score === 3) return '😄';
    if (score === 2) return '😐';
    return '😞';
  }
};

export function WeeklyReport() {
  const overallNutrition = mockWeeklyData.reduce((acc, cur) => acc + cur.nutritionScore, 0) / mockWeeklyData.length;
  const overallMood = mockWeeklyData.reduce((acc, cur) => acc + cur.moodTrend, 0) / mockWeeklyData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Week in Review</CardTitle>
        <CardDescription>Here's a summary of your nutritional intake and mood trends for the past week.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead className="text-center">Nutrition Score</TableHead>
              <TableHead className="text-center">Mood Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockWeeklyData.map((log) => (
              <TableRow key={log.day}>
                <TableCell className="font-medium">{log.day}</TableCell>
                <TableCell className="text-center text-2xl" aria-label={`Nutrition: ${scoreToEmoji('nutrition', log.nutritionScore) === '✅' ? 'Good' : scoreToEmoji('nutrition', log.nutritionScore) === '⚠️' ? 'Neutral' : 'Bad'}`}>{scoreToEmoji('nutrition', log.nutritionScore)}</TableCell>
                <TableCell className="text-center text-2xl" aria-label={`Mood: ${scoreToEmoji('mood', log.moodTrend) === '😄' ? 'Good' : scoreToEmoji('mood', log.moodTrend) === '😐' ? 'Neutral' : 'Bad'}`}>{scoreToEmoji('mood', log.moodTrend)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-muted-foreground">Overall, your nutrition was <span className="font-semibold text-primary">{overallNutrition > 2.5 ? 'Good' : overallNutrition > 1.5 ? 'Okay' : 'Needs Improvement'}</span>.</p>
                     <p className="text-muted-foreground">Your mood trend was generally <span className="font-semibold text-primary">{overallMood > 2.5 ? 'Positive' : overallMood > 1.5 ? 'Neutral' : 'Low'}</span>.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Suggestions for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Try incorporating more leafy greens into your diet for a vitamin boost.</li>
                        <li>Consider reducing processed sugars to avoid energy crashes and improve mood stability.</li>
                        <li>Hydration is key! Aim for 8 glasses of water a day.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}
