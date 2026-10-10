import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import RecentWorkflowsTable from '../components/dashboard/RecentWorkflowsTable.jsx'
import RecentExecutionsTable from '../components/dashboard/RecentExecutionsTable.jsx'
import CreateWorkflowModal from '../components/workflow-list/CreateWorkflowModal.jsx'
import workflowService from '../services/workflowService.js'
import {
  GitFork,
  CheckCircle2,
  PlayCircle,
  XCircle,
  Zap,
  Plus,
} from 'lucide-react'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const res = await workflowService.getStats()
      setStats(res.data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard metrics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleWorkflowCreated = (workflow) => {
    fetchStats()
    navigate('/workflows')
  }

  const metrics = stats?.metrics || {
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
  }

  return (
    <AppLayout title="Dashboard" onOpenCreateModal={() => setIsModalOpen(true)}>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Banner / Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Orchestration Center
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Monitor active workflow automations, webhook triggers, and node execution performance.
            </p>
          </div>
          <button
            id="dashboard-new-workflow-btn"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Workflow</span>
          </button>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            id="stat-total-workflows"
            title="Total Workflows"
            value={metrics.totalWorkflows}
            icon={GitFork}
            color="indigo"
            subtext="Configured pipelines"
          />
          <StatCard
            id="stat-active-workflows"
            title="Active Workflows"
            value={metrics.activeWorkflows}
            icon={Zap}
            color="emerald"
            subtext="Receiving triggers"
          />
          <StatCard
            id="stat-total-executions"
            title="Total Executions"
            value={metrics.totalExecutions}
            icon={PlayCircle}
            color="blue"
            subtext="Lifetime runs"
          />
          <StatCard
            id="stat-successful-executions"
            title="Successful Runs"
            value={metrics.successfulExecutions}
            icon={CheckCircle2}
            color="emerald"
            subtext="Completed cleanly"
          />
          <StatCard
            id="stat-failed-executions"
            title="Failed Runs"
            value={metrics.failedExecutions}
            icon={XCircle}
            color="rose"
            subtext="Node errors / breaks"
          />
        </div>

        {/* Tables Grid: Recent Workflows & Recent Executions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentWorkflowsTable workflows={stats?.recentWorkflows || []} />
          <RecentExecutionsTable executions={stats?.recentExecutions || []} />
        </div>
      </div>

      {/* Workflow Creation Modal */}
      <CreateWorkflowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleWorkflowCreated}
      />
    </AppLayout>
  )
}

export default DashboardPage
