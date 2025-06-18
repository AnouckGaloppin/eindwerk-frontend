import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'teal' | 'white' | 'gray';
  text?: string;
  className?: string;
  'aria-label'?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

const colorClasses = {
  teal: 'border-teal-500',
  white: 'border-white',
  gray: 'border-gray-500'
};

export default function Loader({ 
  size = 'md', 
  color = 'teal', 
  text,
  className = '',
  'aria-label': ariaLabel
}: LoaderProps) {
  const defaultAriaLabel = text || 'Loading';
  const finalAriaLabel = ariaLabel || defaultAriaLabel;

  return (
    <div 
      className={`flex flex-col items-center justify-center space-y-2 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={finalAriaLabel}
    >
      <div 
        className={`animate-spin rounded-full border-2 border-gray-200 border-t-2 ${sizeClasses[size]} ${colorClasses[color]}`}
        style={{ borderTopColor: 'transparent' }}
        aria-hidden="true"
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
      <span className="sr-only">{finalAriaLabel}</span>
    </div>
  );
}

// Convenience components for common use cases
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <Loader size="lg" text={text} aria-label={text} />
    </div>
  );
}

export function CardLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div 
      className="p-8 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <Loader size="md" text={text} aria-label={text} />
    </div>
  );
}

export function InlineLoader({ text }: { text?: string }) {
  return (
    <div 
      className="flex items-center justify-center py-4"
      role="status"
      aria-live="polite"
      aria-label={text || "Loading"}
    >
      <Loader size="sm" text={text} aria-label={text} />
    </div>
  );
}

export function InfiniteScrollLoader({ text = "Loading more..." }: { text?: string }) {
  return (
    <div 
      className="flex items-center justify-center py-4"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <Loader size="sm" text={text} aria-label={text} />
    </div>
  );
} 