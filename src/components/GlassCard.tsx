import { cn } from '@/lib/utils';
import { ReactNode, CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  style?: CSSProperties;
}

export function GlassCard({ children, className, glow = false, style }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card p-6 transition-all duration-300',
        glow && 'glow-border hover:shadow-[0_0_60px_hsl(175_80%_50%/0.4)]',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
