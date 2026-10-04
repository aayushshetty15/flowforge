import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { LogOut, ShieldCheck, User, Zap, Activity } from 'lucide-react'

export const DashboardPage = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-600/30">
            FF
          </div>
          <span className="font-bold text-lg tracking-tight text-white">FlowForge</span>
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
            Phase 2: Auth Active
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-lg">
            <User className="w-4 h-4 text-indigo-400" />
            <span className="font-medium text-white">{user?.name}</span>
            <span className="text-slate-500 text-xs">({user?.email})</span>
          </div>

          <button
            id="dashboard-logout-button"
            onClick={logout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-6xl w-full mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h2>
              <p className="text-slate-400 text-sm mt-1">
                Your authenticated session is active and secure with JWT & bcrypt protection.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>JWT Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium uppercase tracking-wider">Account ID</span>
              </div>
              <p className="text-sm font-mono text-slate-300 break-all">{user?.id}</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium uppercase tracking-wider">Authentication State</span>
              </div>
              <p className="text-sm font-semibold text-emerald-400">Authenticated & Active</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-xl">
              <div className="flex items-center gap-3 text-slate-400 mb-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-medium uppercase tracking-wider">Next Milestone</span>
              </div>
              <p className="text-sm font-medium text-slate-300">Phase 3: Workflows CRUD</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
