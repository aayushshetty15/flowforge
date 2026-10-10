import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, GitFork, PlayCircle, ShieldCheck, X } from 'lucide-react'

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      id: 'sidebar-link-dashboard',
    },
    {
      to: '/workflows',
      label: 'Workflows',
      icon: GitFork,
      id: 'sidebar-link-workflows',
    },
    {
      to: '/executions',
      label: 'Executions',
      icon: PlayCircle,
      id: 'sidebar-link-executions',
    },
  ]

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 select-none transition-transform duration-200 md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div>
        {/* Brand */}
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-600/30">
              FF
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">FlowForge</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Automation</span>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Platform
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                id={item.id}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Environment</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>MongoDB flowforge</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
