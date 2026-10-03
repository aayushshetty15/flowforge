import React, { useEffect, useState } from 'react'

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth(data)
        setLoading(false)
      })
      .catch((err) => {
        setHealth({ status: 'error', message: err.message })
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/30">
            FF
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">FlowForge</h1>
            <p className="text-xs text-slate-400">Workflow Automation Platform</p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-5 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Phase:</span>
            <span className="font-semibold text-indigo-400">Phase 1 — Setup & Initialization</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Frontend:</span>
            <span className="font-medium text-emerald-400">Active (React 19 + Vite + Tailwind)</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Backend API:</span>
            {loading ? (
              <span className="text-slate-500">Checking...</span>
            ) : health?.status === 'ok' ? (
              <span className="font-medium text-emerald-400">Connected ({health.service})</span>
            ) : (
              <span className="font-medium text-amber-400">Standby ({health?.message || 'Waiting for server'})</span>
            )}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Database:</span>
            {health?.database ? (
              <span className="font-medium text-emerald-400">{health.database}</span>
            ) : (
              <span className="font-medium text-slate-500">MongoDB Atlas (flowforge)</span>
            )}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          FlowForge Architecture Initialized
        </div>
      </div>
    </div>
  )
}

export default App
