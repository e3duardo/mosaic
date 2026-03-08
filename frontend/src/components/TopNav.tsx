import { Link, useLocation } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import { MedicationsPopover } from '@/components/MedicationsPopover'
import logo from '@/assets/logo.svg'

type TopNavProps = {
  variant?: 'minimal' | 'full'
}

export function TopNav({ variant = 'full' }: TopNavProps) {
  const location = useLocation()
  const isReports = location.pathname.startsWith('/reports')
  const isMinimal = variant === 'minimal'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 ${
        isMinimal ? 'bg-transparent' : 'bg-background/95 backdrop-blur border-b border-border'
      }`}
    >
      <div className="flex items-center gap-6">
        {!isMinimal && (
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="" className="w-8 h-8" />
            <span className="font-semibold caveat-title" style={{ fontSize: '1.25rem', color: '#1C3F6B' }}>
              Mosaic
            </span>
          </Link>
        )}
        {!isMinimal && (
          <Link
            to="/reports"
            className={`hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              isReports ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <BarChart3 size={18} />
            Relatórios
          </Link>
        )}
      </div>
      <div className={`flex items-center gap-2 ${isMinimal ? 'ml-auto' : ''}`}>
        {isMinimal && (
          <>
            <Link
              to="/reports"
              className="flex items-center justify-center size-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Relatórios"
            >
              <BarChart3 size={20} />
            </Link>
            <MedicationsPopover iconOnly />
          </>
        )}
        {!isMinimal && <MedicationsPopover />}
      </div>
    </nav>
  )
}
