import { ReactNode, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CardLoader } from '@/components/ui/Loader';

// Dynamically import PullToRefresh with no SSR
const PullToRefresh = dynamic(() => import('react-pull-to-refresh'), {
  ssr: false,
  loading: () => null
});

interface RefreshableContentProps {
  children: ReactNode;
  onRefresh: () => Promise<any>;
  className?: string;
}

export default function RefreshableContent({ children, onRefresh, className = '' }: RefreshableContentProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Don't render PullToRefresh on server side
  if (!isMounted) {
    return <>{children}</>;
  }

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