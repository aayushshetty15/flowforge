import React from 'react'
import { PlayCircle, CheckCircle2, XCircle, Clock } from 'lucide-react'

export const RecentExecutionsTable = ({ executions = [] }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Success
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3 animate-spin" />
            Running
          </span>
        )
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Recent Executions</h3>
          <p className="text-xs text-slate-500 mt-0.5">Execution history across triggered workflows</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3">Workflow</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Started At</th>
              <th className="px-5 py-3">Duration</th>
              <th className="px-5 py-3 text-right">Execution ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {executions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PlayCircle className="w-6 h-6 text-slate-600" />
                    <span>No executions triggered yet</span>
                  </div>
                </td>
              </tr>
            ) : (
              executions.map((ex) => {
                const startedDate = new Date(ex.startedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })

                const duration =
                  ex.completedAt && ex.startedAt
                    ? `${Math.max(1, Math.round((new Date(ex.completedAt) - new Date(ex.startedAt))))}ms`
                    : 'In progress'

                return (
                  <tr key={ex._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white">
                      {ex.workflowId?.name || 'Unnamed Workflow'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">{getStatusBadge(ex.status)}</td>
                    <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{startedDate}</td>
                    <td className="px-5 py-3.5 text-slate-300 font-mono">{duration}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-500 text-[11px]">
                      {ex._id?.substring(0, 8)}...
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentExecutionsTable
