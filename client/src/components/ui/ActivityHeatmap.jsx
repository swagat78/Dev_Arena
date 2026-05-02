import React, { useMemo } from 'react';

const ActivityHeatmap = ({ data = [] }) => {
  // Generate the last 365 days
  const days = useMemo(() => {
    const today = new Date();
    const arr = [];
    
    // Find what day of the week today is (0 = Sunday, 6 = Saturday)
    // We want to pad the beginning so the grid always aligns correctly.
    // However, a simple grid-rows-7 grid-flow-col works perfectly if we just supply the last 365 days.
    
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push(d.toISOString().split('T')[0]);
    }
    return arr;
  }, []);

  // Convert array to dictionary for O(1) lookup
  const activityDict = useMemo(() => {
    const dict = {};
    data.forEach(item => {
      dict[item.date] = item.count;
    });
    return dict;
  }, [data]);

  const getIntensityClass = (count) => {
    if (!count) return 'bg-[#1e293b]/50 border-slate-800/50 light:bg-slate-100 light:border-slate-200';
    if (count === 1) return 'bg-brand-900/80 border-brand-800/50 light:bg-brand-200 light:border-brand-300';
    if (count <= 3) return 'bg-brand-700/80 border-brand-600/50 light:bg-brand-400 light:border-brand-500';
    if (count <= 6) return 'bg-brand-500/80 border-brand-400/50 light:bg-brand-500 light:border-brand-600';
    return 'bg-brand-400/90 border-brand-300/50 light:bg-brand-600 light:border-brand-700 shadow-[0_0_8px_rgba(79,124,255,0.4)]';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate total submissions for the summary
  const totalSubmissions = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
      <div className="min-w-[800px]">
        <div className="flex justify-between items-end mb-2">
          <h3 className="text-sm font-semibold text-slate-300 light:text-slate-600">
            {totalSubmissions} submissions in the last year
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Less</span>
            <div className={`w-3 h-3 rounded-sm border ${getIntensityClass(0)}`} />
            <div className={`w-3 h-3 rounded-sm border ${getIntensityClass(1)}`} />
            <div className={`w-3 h-3 rounded-sm border ${getIntensityClass(3)}`} />
            <div className={`w-3 h-3 rounded-sm border ${getIntensityClass(6)}`} />
            <div className={`w-3 h-3 rounded-sm border ${getIntensityClass(10)}`} />
            <span>More</span>
          </div>
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-between text-[10px] text-slate-500 pr-2 py-1 h-[105px]">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Grid */}
          <div className="grid grid-rows-7 grid-flow-col gap-1 flex-1">
            {days.map((date) => {
              const count = activityDict[date] || 0;
              return (
                <div
                  key={date}
                  className={`w-3 h-3 rounded-sm border transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer ${getIntensityClass(count)}`}
                  title={`${count} submissions on ${date}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ActivityHeatmap;
