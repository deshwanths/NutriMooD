import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type StatCardProps = {
  label: string;
  value: number | string;
  unit?: string;
}

export function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <Card className="text-center">
      <CardHeader className="p-2 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <p className="text-2xl font-bold text-primary">
          {value}{unit && <span className="text-sm font-normal text-muted-foreground">{unit}</span>}
        </p>
      </CardContent>
    </Card>
  )
}
