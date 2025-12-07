import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity as ActivityType } from '@/hooks/useActivities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategoryColor, getCategoryLabel, CATEGORIES } from '@/lib/constants';
import { Clock, TrendingUp, PieChart as PieIcon, BarChart2 } from 'lucide-react';

interface AnalyticsViewProps {
  activities: ActivityType[];
}

export function AnalyticsView({ activities }: AnalyticsViewProps) {
  const categoryData = useMemo(() => {
    const grouped: Record<string, number> = {};
    
    activities.forEach(activity => {
      if (!grouped[activity.category]) {
        grouped[activity.category] = 0;
      }
      grouped[activity.category] += activity.duration_minutes;
    });

    return Object.entries(grouped)
      .map(([category, minutes]) => ({
        name: getCategoryLabel(category),
        value: minutes,
        color: getCategoryColor(category),
        hours: (minutes / 60).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);
  }, [activities]);

  const topActivities = useMemo(() => {
    return [...activities]
      .sort((a, b) => b.duration_minutes - a.duration_minutes)
      .slice(0, 5)
      .map(a => ({
        name: a.title.length > 20 ? a.title.slice(0, 20) + '...' : a.title,
        minutes: a.duration_minutes,
        hours: (a.duration_minutes / 60).toFixed(1),
        color: getCategoryColor(a.category),
      }));
  }, [activities]);

  const totalHours = (activities.reduce((sum, a) => sum + a.duration_minutes, 0) / 60).toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 border border-border shadow-lg">
          <p className="font-medium">{payload[0].payload.name || label}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].payload.hours || (payload[0].value / 60).toFixed(1)} hours
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-success/10">
          <TrendingUp className="w-6 h-6 text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Day Complete!</h2>
          <p className="text-muted-foreground">Here's how you spent your {totalHours} hours</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card glass className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieIcon className="w-5 h-5 text-primary" />
              Time by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="vertical" 
                    align="right" 
                    verticalAlign="middle"
                    formatter={(value: string) => (
                      <span className="text-sm text-foreground">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card glass className="hover-lift">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart2 className="w-5 h-5 text-accent" />
              Top Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topActivities} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="minutes" 
                    radius={[0, 8, 8, 0]}
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {topActivities.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card glass className="hover-lift">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-warning" />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryData.map((cat, index) => (
              <div 
                key={cat.name}
                className="p-4 rounded-xl bg-secondary/30 border border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm font-medium truncate">{cat.name}</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: cat.color }}>
                  {cat.hours}h
                </p>
                <p className="text-xs text-muted-foreground">
                  {((cat.value / 1440) * 100).toFixed(1)}% of day
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
