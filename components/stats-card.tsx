import { Card } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  description?: string
  trend?: string
}

export function StatsCard({ title, value, description, trend }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">
          {title}
        </h3>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        {trend && (
          <p className="text-xs text-green-600">
            {trend}
          </p>
        )}
      </div>
    </Card>
  )
}
