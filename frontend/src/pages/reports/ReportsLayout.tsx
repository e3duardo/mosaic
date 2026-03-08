import { NavLink, Outlet } from 'react-router-dom'
import { DollarSign, Pill, Lightbulb, Bell } from 'lucide-react'
import { TopNav } from '@/components/TopNav'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/reports/financial', label: 'Financial', icon: DollarSign },
  { to: '/reports/medicamentos', label: 'Medicamentos', icon: Pill },
  { to: '/reports/ideas', label: 'Ideas', icon: Lightbulb },
  { to: '/reports/remember', label: 'Remember', icon: Bell },
]

export function ReportsLayout() {
  return (
    <div className="min-h-screen bg-muted/30 flex relative">
      <TopNav variant="full" />
      <aside className="w-56 bg-card border-r border-border p-4 pt-16">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Relatórios
        </h2>
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 pt-20 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
