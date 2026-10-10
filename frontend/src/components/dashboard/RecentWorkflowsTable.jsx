import React from 'react'
import { Link } from 'react-router-dom'
import { GitFork, ArrowUpRight, Radio } from 'lucide-react'

export const RecentWorkflowsTable = ({ workflows = [] }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
            Inactive
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Draft
          </span>
        )
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Recent Workflows</h3>
          <p className="text-xs text-slate-500 mt-0.5">Most recently updated automation pipelines</p>
        </div>
        <Link
          to="/workflows"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
        >
          View all <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-5 py-3">Workflow Name</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Nodes</th>
              <th className="px-5 py-3">Trigger</th>
              <th className="px-5 py-3">Last Updated</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {workflows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <GitFork className="w-6 h-6 text-slate-600" />
                    <span>No workflows created yet</span>
                  </div>
                </td>
              </tr>
            ) : (
              workflows.map((wf) => {
                const nodeCount = Array.isArray(wf.nodes) ? wf.nodes.length : 0
                const updatedDate = new Date(wf.updatedAt || wf.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <tr key={wf._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-white">
                      <div className="flex flex-col">
                        <span>{wf.name}</span>
                        {wf.description && (
                          <span className="text-[11px] text-slate-500 truncate max-w-xs">
                            {wf.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">{getStatusBadge(wf.status)}</td>
                    <td className="px-5 py-3.5 text-slate-300 font-mono">{nodeCount} nodes</td>
                    <td className="px-5 py-3.5">
                      {wf.webhook ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-indigo-400 font-medium">
                          <Radio className="w-3 h-3" /> Webhook
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Manual</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">{updatedDate}</td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <Link
                        to={`/workflows`}
                        className="px-2.5 py-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded transition-colors"
                      >
                        Manage
                      </Link>
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

export default RecentWorkflowsTable
