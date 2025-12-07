export const MAX_MINUTES_PER_DAY = 1440;

export const CATEGORIES = [
  { value: 'work', label: 'Work', color: 'hsl(250 85% 65%)' },
  { value: 'study', label: 'Study', color: 'hsl(280 75% 60%)' },
  { value: 'exercise', label: 'Exercise', color: 'hsl(145 70% 45%)' },
  { value: 'entertainment', label: 'Entertainment', color: 'hsl(35 90% 55%)' },
  { value: 'sleep', label: 'Sleep', color: 'hsl(200 85% 55%)' },
  { value: 'meals', label: 'Meals', color: 'hsl(0 72% 55%)' },
  { value: 'social', label: 'Social', color: 'hsl(320 70% 55%)' },
  { value: 'personal', label: 'Personal Care', color: 'hsl(175 80% 50%)' },
  { value: 'commute', label: 'Commute', color: 'hsl(60 70% 50%)' },
  { value: 'other', label: 'Other', color: 'hsl(220 15% 50%)' },
] as const;

export const getCategoryColor = (category: string): string => {
  const found = CATEGORIES.find(c => c.value === category);
  return found?.color || 'hsl(220 15% 50%)';
};

export const getCategoryLabel = (category: string): string => {
  const found = CATEGORIES.find(c => c.value === category);
  return found?.label || category;
};
