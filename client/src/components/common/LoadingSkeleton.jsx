import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 animate-pulse">
    <div className="w-full h-48 bg-slate-200 rounded-lg mb-4"></div>
    <div className="flex justify-between items-center mb-2">
      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
    </div>
    <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
    <div className="h-9 bg-slate-200 rounded w-full"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full animate-pulse">
    <div className="h-10 bg-slate-200 rounded mb-4"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-14 bg-slate-100 rounded mb-2"></div>
    ))}
  </div>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 h-28">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
      </div>
    ))}
  </div>
);

