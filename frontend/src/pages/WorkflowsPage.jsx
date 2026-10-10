import React, { useEffect, useState, useCallback } from 'react'
import AppLayout from '../components/layout/AppLayout.jsx'
import WorkflowCard from '../components/workflow-list/WorkflowCard.jsx'
import WorkflowFilterBar from '../components/workflow-list/WorkflowFilterBar.jsx'
import CreateWorkflowModal from '../components/workflow-list/CreateWorkflowModal.jsx'
import workflowService from '../services/workflowService.js'
import { GitFork, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

export const WorkflowsPage = () => {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchWorkflows = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 12,
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }
      const res = await workflowService.getWorkflows(params)
      setWorkflows(res.data.workflows || [])
      setPagination(res.data.pagination || { total: 0, totalPages: 1 })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load workflows')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  const handleActivate = async (id) => {
    try {
      const res = await workflowService.activateWorkflow(id)
      setWorkflows((prev) =>
        prev.map((wf) => (wf._id === id ? res.data.workflow : wf))
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to activate workflow')
    }
  }

  const handleDeactivate = async (id) => {
    try {
      const res = await workflowService.deactivateWorkflow(id)
      setWorkflows((prev) =>
        prev.map((wf) => (wf._id === id ? res.data.workflow : wf))
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate workflow')
    }
  }

  const handleDelete = async (id) => {
    try {
      await workflowService.deleteWorkflow(id)
      setWorkflows((prev) => prev.filter((wf) => wf._id !== id))
      fetchWorkflows()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete workflow')
    }
  }

  const handleWorkflowCreated = () => {
    fetchWorkflows()
  }

  return (
    <AppLayout title="Workflows" onOpenCreateModal={() => setIsModalOpen(true)}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Workflows</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Design, configure, and monitor automated pipelines
            </p>
          </div>
          <button
            id="workflows-create-btn"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workflow</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <WorkflowFilterBar
          search={search}
          onSearchChange={(val) => {
            setSearch(val)
            setPage(1)
          }}
          statusFilter={statusFilter}
          onStatusChange={(val) => {
            setStatusFilter(val)
            setPage(1)
          }}
          total={pagination.total}
        />

        {/* Workflow Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-500 space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-xs">Loading workflows...</p>
          </div>
        ) : workflows.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No workflows found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter to find matching workflows.'
                : 'Get started by creating your first automated workflow pipeline.'}
            </p>
            <button
              id="empty-create-workflow-btn"
              onClick={() => setIsModalOpen(true)}
              className="mt-6 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Workflow</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflows.map((wf) => (
              <WorkflowCard
                key={wf._id}
                workflow={wf}
                onActivate={handleActivate}
                onDeactivate={handleDeactivate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span>
              Showing page <strong className="text-white">{page}</strong> of{' '}
              <strong className="text-white">{pagination.totalPages}</strong> ({pagination.total} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-40 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-40 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Creation Modal */}
      <CreateWorkflowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleWorkflowCreated}
      />
    </AppLayout>
  )
}

export default WorkflowsPage
