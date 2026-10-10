import React from 'react'

export const StatCard = ({ title, value, icon: Icon, color, subtext, id }) => {
  const colorMap = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  }

  const activeColor = colorMap[color] || colorMap.indigo

  return (
    <div
      id={id}
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700/80 transition-all flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${activeColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold text-white tracking-tight">
          {value !== undefined ? value : 0}
        </div>
        {subtext && (
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{subtext}</p>
        )}
      </div>
    </div>
  )
}

export default StatCard
