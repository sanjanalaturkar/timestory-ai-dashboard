import { Clock, Activity, Layers, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ProgressRing } from './ProgressRing';
import { Activity as ActivityType } from '@/hooks/useActivities';
import { MAX_MINUTES_PER_DAY } from '@/lib/constants';

interface TimeStatsProps {
  totalMinutes: number;
  remainingMinutes: number;
  activities: ActivityType[];
}

export function TimeStats({ totalMinutes, remainingMinutes, activities }: TimeStatsProps) {
  const progress = (totalMinutes / MAX_MINUTES_PER_DAY) * 100;
  const uniqueCategories = new Set(activities.map(a => a.category)).size;

  const formatTime = (mins: number) => {
    const h = Math.floor(Math.abs(mins) / 60);
    const m = Math.abs(mins) % 60;
    return `${h}h ${m}m`;
  };

  const stats = [
    {
      icon: Clock,
      label: 'Total Logged',
      value: formatTime(totalMinutes),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Target,
      label: 'Remaining',
      value: remainingMinutes >= 0 ? formatTime(remainingMinutes) : '0h 0m',
      color: remainingMinutes > 0 ? 'text-accent' : 'text-success',
      bgColor: remainingMinutes > 0 ? 'bg-accent/10' : 'bg-success/10',
    },
    {
      icon: Activity,
      label: 'Activities',
      value: String(activities.length),
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: Layers,
      label: 'Categories',
      value: String(uniqueCategories),
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in">
      <Card glass className="col-span-2 lg:col-span-1 p-6 flex items-center justify-center">
        <ProgressRing progress={progress} size={100} />
      </Card>

      {stats.map((stat, index) => (
        <Card 
          key={stat.label} 
          glass 
          className="p-4 hover-lift"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </p>
              <p className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
