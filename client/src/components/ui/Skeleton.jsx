import React from 'react';

export function Skeleton({ className = '', lines = 1 }) {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`skeleton h-4 ${className}`} />
        ))}
      </div>
    );
  }
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard({ className = 'h-44' }) {
  return (
    <div className={`panel p-4 ${className}`}>
      <Skeleton className="mb-3 h-4 w-1/3" />
      <Skeleton className="mb-2 h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}