import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'teal' | 'white' | 'gray';
  text?: string;
  className?: string;
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
  className = '' 
}: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 border-gray-200 border-t-2 ${sizeClasses[size]} ${colorClasses[color]}`}
        style={{ borderTopColor: 'transparent' }}
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
}

// Convenience components for common use cases
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="lg" text={text} />
    </div>
  );
}

export function CardLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="p-8 flex items-center justify-center">
      <Loader size="md" text={text} />
    </div>
  );
}

export function InlineLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-4">
      <Loader size="sm" text={text} />
    </div>
  );
}

export function InfiniteScrollLoader({ text = "Loading more..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-4">
      <Loader size="sm" text={text} />
    </div>
  );
} 