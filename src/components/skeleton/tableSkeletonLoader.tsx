import React from 'react';

export default function TableSkeletonLoader ({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className={`flex border-b border-gray-200 py-4 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="px-4 py-3 flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};