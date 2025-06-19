import { ReactNode, useState } from 'react';
import PullToRefresh from 'react-pull-to-refresh';
import { CardLoader } from '@/components/ui/Loader';

interface RefreshableContentProps {
  children: ReactNode;
  onRefresh: () => Promise<any>;
  className?: string;
}

export default function RefreshableContent({ children, onRefresh, className = '' }: RefreshableContentProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await onRefresh();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      className={`relative ${className}`}
      style={{
        textAlign: 'inherit' // Override default styling
      }}
    >
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <CardLoader text="Refreshing..." />
        </div>
      )}
      {children}
    </PullToRefresh>
  );
} 