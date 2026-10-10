import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GitFork,
  Radio,
  Copy,
  Check,
  Power,
  Trash2,
  Calendar,
  ExternalLink,
  Activity,
} from 'lucide-react'

export const WorkflowCard = ({
  workflow,
  onActivate,
  onDeactivate,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const nodeCount = Array.isArray(workflow.nodes) ? workflow.nodes.length : 0
  const edgeCount = Array.isArray(workflow.edges) ? workflow.edges.length : 0

  const handleCopyWebhook = () => {
    if (!workflow.webhook?.token) return
    const webhookUrl = `${window.location.origin}/api/webhooks/${workflow.webhook.token}`
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
      setIsDeleting(true)
      onDelete(workflow._id)
    }
  }

  const getStatusBadge = () => {
    switch (workflow.status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
            Inactive
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Draft
          </span>
        )
    }
  }

  const formattedDate = new Date(workflow.updatedAt || workflow.createdAt).toLocaleDateString(
    undefined,
    { month: 'short', day: 'numeric', year: 'numeric' }
  )

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700/80 transition-all flex flex-col justify-between group">
      <div>
        {/* Header: Title and Status */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <GitFork className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-base truncate group-hover:text-indigo-400 transition-colors">
              {workflow.name}
            </h3>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px] mt-1">
          {workflow.description || 'No description provided.'}
        </p>

        {/* Meta stats */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
          <span className="font-mono">
            <strong className="text-slate-200">{nodeCount}</strong> nodes
          </span>
          <span>•</span>
          <span className="font-mono">
            <strong className="text-slate-200">{edgeCount}</strong> edges
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>

        {/* Webhook snippet if active */}
        {workflow.webhook && (
          <div className="mt-3 p-2 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 truncate text-slate-400 text-[11px]">
              <Radio className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">/api/webhooks/{workflow.webhook.token.substring(0, 12)}...</span>
            </div>
            <button
              onClick={handleCopyWebhook}
              title="Copy Webhook URL"
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {workflow.status === 'active' ? (
            <button
              onClick={() => onDeactivate(workflow._id)}
              title="Deactivate Workflow"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-md transition-colors cursor-pointer"
            >
              <Power className="w-3 h-3" />
              <span>Deactivate</span>
            </button>
          ) : (
            <button
              onClick={() => onActivate(workflow._id)}
              title="Activate Workflow"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-md transition-colors cursor-pointer"
            >
              <Power className="w-3 h-3" />
              <span>Activate</span>
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete Workflow"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/executions?workflowId=${workflow._id}`}
            title="View Execution History"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-750 rounded-md transition-colors"
          >
            <Activity className="w-3 h-3 text-indigo-400" />
            <span>Logs</span>
          </Link>

          <Link
            to={`/workflows/${workflow._id}/edit`}
            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm shadow-indigo-600/30 transition-all"
          >
            <span>Canvas</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WorkflowCard
