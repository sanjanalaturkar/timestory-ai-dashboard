import { useState } from 'react';
import { Trash2, Edit2, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Activity } from '@/hooks/useActivities';
import { CATEGORIES, getCategoryColor, getCategoryLabel } from '@/lib/constants';

interface ActivityCardProps {
  activity: Activity;
  onUpdate: (id: string, updates: Partial<Pick<Activity, 'title' | 'category' | 'duration_minutes'>>) => Promise<{ error: Error | null }>;
  onDelete: (id: string) => Promise<{ error: Error | null }>;
  maxAdditionalMinutes: number;
}

export function ActivityCard({ activity, onUpdate, onDelete, maxAdditionalMinutes }: ActivityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(activity.title);
  const [category, setCategory] = useState(activity.category);
  const [hours, setHours] = useState(String(Math.floor(activity.duration_minutes / 60)));
  const [minutes, setMinutes] = useState(String(activity.duration_minutes % 60));
  const [loading, setLoading] = useState(false);

  const categoryColor = getCategoryColor(activity.category);
  const categoryLabel = getCategoryLabel(activity.category);

  const handleSave = async () => {
    const newDuration = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    if (!title.trim() || !category || newDuration <= 0) return;

    setLoading(true);
    const { error } = await onUpdate(activity.id, {
      title: title.trim(),
      category,
      duration_minutes: newDuration,
    });

    if (!error) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setTitle(activity.title);
    setCategory(activity.category);
    setHours(String(Math.floor(activity.duration_minutes / 60)));
    setMinutes(String(activity.duration_minutes % 60));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await onDelete(activity.id);
    setLoading(false);
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  if (isEditing) {
    return (
      <Card glass className="p-4 animate-scale-in">
        <div className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Activity title"
            className="font-medium"
          />
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Hours"
              min="0"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Minutes"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel} disabled={loading}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={loading}>
              {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card glass className="p-4 hover-lift group">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div 
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: categoryColor }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{activity.title}</h4>
            <p className="text-sm text-muted-foreground">{categoryLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-medium bg-secondary/50 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            {formatDuration(activity.duration_minutes)}
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={loading}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
