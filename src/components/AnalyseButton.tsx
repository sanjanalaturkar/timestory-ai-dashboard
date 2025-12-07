import { Sparkles, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnalyseButtonProps {
  isUnlocked: boolean;
  onClick: () => void;
  remainingMinutes: number;
}

export function AnalyseButton({ isUnlocked, onClick, remainingMinutes }: AnalyseButtonProps) {
  if (isUnlocked) {
    return (
      <Button
        onClick={onClick}
        size="xl"
        variant="hero"
        className="group animate-pulse-glow"
      >
        <Sparkles className="w-5 h-5 animate-spin-slow" />
        <span>Analyse Your Day</span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </Button>
    );
  }

  const formatRemaining = () => {
    const h = Math.floor(remainingMinutes / 60);
    const m = remainingMinutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        disabled
        size="xl"
        className="opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
      >
        <Lock className="w-5 h-5" />
        <span>Analyse Your Day</span>
      </Button>
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-warning animate-pulse" />
        Log {formatRemaining()} more to unlock analytics
      </p>
    </div>
  );
}
