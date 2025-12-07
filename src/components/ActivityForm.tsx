import { useState } from 'react';
import { Plus, Clock, Tag, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { CATEGORIES, MAX_MINUTES_PER_DAY } from '@/lib/constants';

interface ActivityFormProps {
  remainingMinutes: number;
  onAdd: (title: string, category: string, durationMinutes: number) => Promise<{ error: Error | null }>;
}

export function ActivityForm({ remainingMinutes, onAdd }: ActivityFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [loading, setLoading] = useState(false);

  const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
  const isValid = title.trim() && category && totalMinutes > 0 && totalMinutes <= remainingMinutes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    const { error } = await onAdd(title.trim(), category, totalMinutes);
    
    if (!error) {
      setTitle('');
      setCategory('');
      setHours('');
      setMinutes('');
    }
    setLoading(false);
  };

  return (
    <Card glass className="p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Add Activity</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Type className="w-4 h-4" />
            Activity Title
          </Label>
          <Input
            id="title"
            placeholder="What did you do?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="w-4 h-4" />
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select a category" />
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
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Duration
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Hours"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              <span className="text-xs text-muted-foreground mt-1 block">Hours</span>
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Minutes"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
              <span className="text-xs text-muted-foreground mt-1 block">Minutes</span>
            </div>
          </div>
          {totalMinutes > 0 && (
            <p className={`text-sm mt-2 ${totalMinutes > remainingMinutes ? 'text-destructive' : 'text-muted-foreground'}`}>
              {totalMinutes > remainingMinutes 
                ? `Exceeds remaining time by ${totalMinutes - remainingMinutes} minutes`
                : `Total: ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
              }
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isValid || loading}
          className="w-full"
          variant="hero"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
              Adding...
            </span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Activity
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
