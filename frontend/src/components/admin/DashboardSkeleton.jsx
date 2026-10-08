import React from 'react';

const Bone = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />
);

export const DashboardSkeleton = () => (
  <div className="w-full space-y-6 pb-10">
    <div className="space-y-3">
      <Bone className="h-5 w-36" />
      <Bone className="h-9 w-72" />
      <Bone className="h-4 w-96 max-w-full" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex justify-between mb-6">
            <Bone className="h-3 w-24" />
            <Bone className="h-9 w-9 rounded-xl" />
          </div>
          <Bone className="h-8 w-20 mb-3" />
          <Bone className="h-3 w-32" />
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 rounded-2xl border border-[#E2E8F0] bg-white p-6 h-80">
        <Bone className="h-5 w-40 mb-6" />
        <Bone className="h-56 w-full" />
      </div>
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 h-80">
        <Bone className="h-5 w-36 mb-6" />
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <Bone key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-2xl border border-[#E2E8F0] bg-white p-6">
          <Bone className="h-5 w-32 mb-4" />
          <div className="space-y-3">
            {[0, 1, 2, 3].map((j) => (
              <Bone key={j} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardSkeleton;
