import { Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'no-activities' | 'no-data-for-date';
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  if (type === 'no-activities') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-float">
            <Calendar className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-3">Start Your Day's Story</h3>
        <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
          Begin tracking your activities for today. Add your first activity to see 
          how you spend your precious 1,440 minutes each day.
        </p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full">
          <span>Add activities using the form above</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
          <Calendar className="w-16 h-16 text-muted-foreground" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-3">No Data Available</h3>
      <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
        There's no recorded activity data for this date. 
        Select today's date to start tracking your time.
      </p>
      
      {onAction && (
        <Button onClick={onAction} variant="hero">
          <Calendar className="w-4 h-4 mr-2" />
          Go to Today
        </Button>
      )}
    </div>
  );
}
