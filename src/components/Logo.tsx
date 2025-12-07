import { Clock } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-primary to-primary-glow p-2 shadow-glow`}>
        <Clock className="w-full h-full text-primary-foreground" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textClasses[size]} font-bold tracking-tight`}>
            <span className="gradient-text">TimeStory</span>
            <span className="text-accent ml-1">AI</span>
          </span>
        </div>
      )}
    </div>
  );
}
