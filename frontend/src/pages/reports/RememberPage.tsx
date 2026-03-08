import { useQuery } from '@tanstack/react-query'
import { fetchReminders } from '../../api/client'

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return dateStr
  }
}

export function RememberPage() {
  const { data: reminders = [], isLoading } = useQuery({ queryKey: ['reminders'], queryFn: fetchReminders, refetchInterval: 5000 })
  const sorted = [...reminders].sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime())

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Remember</h1>
      {isLoading ? (
        <p className="text-slate-500">Loading...</p>
      ) : reminders.length === 0 ? (
        <p className="text-slate-500">Nenhum lembrete encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {sorted.map((r) => (
            <li key={r.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
              <span className="text-sm text-slate-500 shrink-0">{formatDate(r.due_at)}</span>
              <p className="text-slate-800">{r.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
