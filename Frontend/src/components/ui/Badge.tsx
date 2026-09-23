import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'outline';
  dotColor?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  dotColor,
  className = '',
}) => {
  const variants = {
    default: 'bg-moss/15 text-forest dark:text-cream border-moss/30',
    success: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
    danger: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30',
    gold: 'bg-gold/20 text-gold-600 dark:text-gold border-gold/40',
    outline: 'border border-moss/30 text-forest dark:text-cream',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
};
