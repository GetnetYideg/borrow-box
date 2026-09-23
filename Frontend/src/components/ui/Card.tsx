import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevated = false,
  ...props
}) => {
  return (
    <div
      className={`
        rounded-xl border
        ${
          elevated
            ? 'bg-cream-100 dark:bg-forest-700 border-moss/20 dark:border-forest-50 shadow-md'
            : 'bg-white dark:bg-forest-800 border-moss/15 dark:border-forest-700 shadow-xs'
        }
        transition-colors duration-150
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => (
  <div
    className={`p-5 flex items-start justify-between border-b border-moss/10 dark:border-forest-700/50 ${className}`}
  >
    <div>
      <h3 className="text-base font-bold text-forest dark:text-cream">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-xs text-forest/70 dark:text-cream/70">{subtitle}</p>
      )}
    </div>
    {action && <div className="ml-4">{action}</div>}
  </div>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`p-4 bg-cream-50/50 dark:bg-forest-900/40 border-t border-moss/10 dark:border-forest-700/50 rounded-b-xl flex items-center justify-between ${className}`}
  >
    {children}
  </div>
);
