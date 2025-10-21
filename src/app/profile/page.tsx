import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
    // Mock data
    const user = {
        name: 'Alex Doe',
        email: 'alex.doe@example.com',
        joinDate: '2023-10-01',
        avatar: 'https://picsum.photos/seed/user-profile/200/200',
        goals: ['Improve Mood', 'Eat Healthier', 'Understand Nutrition'],
        stats: {
            scans: 42,
            streak: 7,
        }
    };
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-center gap-6 space-y-0">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left">
                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                        <CardDescription>Member since {new Date(user.joinDate).toLocaleDateString()}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="rounded-lg border p-4">
                            <p className="text-2xl font-bold">{user.stats.scans}</p>
                            <p className="text-sm text-muted-foreground">Total Scans</p>
                        </div>
                        <div className="rounded-lg border p-4">
                            <p className="text-2xl font-bold">{user.stats.streak}</p>
                            <p className="text-sm text-muted-foreground">Day Streak</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Your Goals</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.goals.map(goal => <Badge key={goal} variant="secondary">{goal}</Badge>)}
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>History</CardTitle>
                    <CardDescription>A log of your recent scans.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">Your food log history will appear here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
