import React from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { Plus, LogOut, User, Menu } from 'lucide-react'

export const Navbar = ({ onOpenCreateModal, title, onToggleSidebar }) => {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight truncate">
          {title || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {onOpenCreateModal && (
          <button
            id="navbar-create-workflow-btn"
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Workflow</span>
          </button>
        )}

        <div className="h-5 w-px bg-slate-800" />

        {/* User Info */}
        <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg">
          <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
          </div>
          <span className="font-medium text-slate-200">{user?.name}</span>
        </div>

        {/* Logout Button */}
        <button
          id="navbar-logout-btn"
          onClick={logout}
          title="Sign Out"
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

export default Navbar
