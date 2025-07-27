import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend: string;
  color: "blue" | "green" | "orange" | "purple";
}

export default function StatsCard({ icon: Icon, title, value, trend, color }: StatsCardProps) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-950/20",
    green: "text-green-600 bg-green-50 dark:bg-green-950/20", 
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-950/20",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-950/20"
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <span className="text-2xl font-bold text-foreground">{value}</span>
        </div>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}
