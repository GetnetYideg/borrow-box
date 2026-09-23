import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-moss/20 dark:border-forest-700 rounded-2xl bg-cream-50/50 dark:bg-forest-800/40 my-4">
      <div className="p-3 bg-moss/10 dark:bg-forest-700 rounded-full text-moss dark:text-cream mb-3">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h4 className="text-base font-bold text-forest dark:text-cream">{title}</h4>
      <p className="mt-1 text-xs text-forest/70 dark:text-cream/70 max-w-sm mb-4">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
