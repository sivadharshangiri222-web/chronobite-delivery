import React from 'react';

export const SkeletonLoader = ({ count = 4, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-[#1C1E22] rounded-[16px] p-4 border border-white/[0.07] space-y-3">
            <div className="h-44 skeleton-shimmer rounded-[12px]" />
            <div className="h-5 skeleton-shimmer rounded w-3/4" />
            <div className="h-4 skeleton-shimmer rounded w-1/2" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 skeleton-shimmer rounded-full w-16" />
              <div className="h-6 skeleton-shimmer rounded-full w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-[#1C1E22] rounded-[12px] p-3 border border-white/[0.07] flex gap-3.5">
          <div className="w-24 h-24 skeleton-shimmer rounded-[12px] shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 skeleton-shimmer rounded w-2/3" />
            <div className="h-3 skeleton-shimmer rounded w-full" />
            <div className="h-4 skeleton-shimmer rounded w-1/4 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
