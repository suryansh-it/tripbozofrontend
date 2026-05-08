// components/Skeletons/SkeletonTable.js
export const SkeletonCompareTable = () => (
  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
    {/* Header */}
    <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-100">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-3 sm:p-4 border-r border-slate-100 last:border-r-0">
          <div className="h-4 bg-slate-100 rounded-lg w-3/4 mb-2" />
          <div className="h-3 bg-slate-50 rounded-lg w-1/2" />
        </div>
      ))}
    </div>
    {/* Rows */}
    {[...Array(5)].map((_, row) => (
      <div key={row} className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-100 last:border-b-0">
        {[...Array(4)].map((_, col) => (
          <div key={col} className="p-3 sm:p-4 border-r border-slate-100 last:border-r-0">
            <div className={`h-3 bg-slate-100 rounded-lg ${col === 0 ? 'w-2/3' : 'w-full'}`} />
          </div>
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonProviderGrid = ({ count = 4 }) => (
  <div className="space-y-3 animate-pulse">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="p-4 border border-slate-200 rounded-xl bg-white flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-slate-100 rounded-lg w-32 mb-2" />
          <div className="h-3 bg-slate-50 rounded-lg w-48" />
        </div>
        <div className="h-8 bg-slate-100 rounded-lg w-24" />
      </div>
    ))}
  </div>
);
