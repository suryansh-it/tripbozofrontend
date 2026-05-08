// components/Skeletons/SkeletonSection.js
export const SkeletonSection = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm animate-pulse">
    <div className="h-6 bg-slate-100 rounded-xl w-32 mb-4" />
    <div className="space-y-3">
      <div className="h-4 bg-slate-100 rounded-lg w-full" />
      <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
      <div className="h-4 bg-slate-100 rounded-lg w-4/5" />
    </div>
  </div>
);

export const SkeletonHero = () => (
  <div className="rounded-2xl bg-gradient-to-r from-slate-200 to-slate-100 border border-slate-300 shadow-md animate-pulse h-48 sm:h-56 md:h-64" />
);

export const SkeletonTextBlock = ({ lines = 3 }) => (
  <div className="space-y-2 animate-pulse">
    {[...Array(lines)].map((_, i) => (
      <div key={i} className={`h-4 bg-slate-100 rounded-lg ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);
