// components/Skeletons/SkeletonCard.js
export const SkeletonCard = ({ className = "h-48" }) => (
  <div className={`rounded-3xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 shadow-sm animate-pulse ${className}`}>
    <div className="h-full w-full" />
  </div>
);

export const SkeletonSmallCard = ({ className = "h-32" }) => (
  <div className={`rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 shadow-sm animate-pulse ${className}`}>
    <div className="h-full w-full" />
  </div>
);

export const SkeletonLargeCard = ({ className = "h-64" }) => (
  <div className={`rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 shadow-sm animate-pulse ${className}`}>
    <div className="h-full w-full" />
  </div>
);
