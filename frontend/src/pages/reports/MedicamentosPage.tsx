import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMedicines, fetchAppointments } from '../../api/client'

function formatDateTime(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return { date: d.toLocaleDateString('pt-BR'), time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }
  } catch {
    return { date: dateStr, time: '' }
  }
}

export function MedicamentosPage() {
  const { data: medicines = [] } = useQuery({ queryKey: ['medicines'], queryFn: fetchMedicines, refetchInterval: 5000 })
  const { data: appointments = [] } = useQuery({ queryKey: ['appointments'], queryFn: fetchAppointments, refetchInterval: 5000 })

  const items = useMemo(() => {
    const list = [
      ...medicines.map((m) => ({ ...formatDateTime(m.taken_at), type: 'medicine' as const, label: m.name, detail: `Quantidade: ${m.quantity}`, sortKey: new Date(m.taken_at).getTime() })),
      ...appointments.map((a) => ({ ...formatDateTime(a.scheduled_at), type: 'appointment' as const, label: a.description, detail: undefined, sortKey: new Date(a.scheduled_at).getTime() })),
    ]
    return list.sort((a, b) => b.sortKey - a.sortKey)
  }, [medicines, appointments])

  const byDate = useMemo(() => {
    const map = new Map<string, typeof items>()
    for (const item of items) {
      const list = map.get(item.date) || []
      list.push(item)
      map.set(item.date, list)
    }
    return map
  }, [items])

  const sortedDates = useMemo(
    () =>
      Array.from(byDate.keys())
        .sort((a, b) => {
          const [da, ma, ya] = a.split('/').map(Number)
          const [db, mb, yb] = b.split('/').map(Number)
          return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime()
        })
        .reverse(),
    [byDate]
  )

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Medicamentos</h1>
      {items.length === 0 ? (
        <p className="text-slate-500">Nenhum registro encontrado.</p>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 font-medium text-slate-700">{date}</div>
              <ul className="divide-y divide-slate-100">
                {(byDate.get(date) || []).map((item, i) => (
                  <li key={i} className="px-4 py-3 flex items-start gap-3">
                    <span className="text-sm text-slate-500 shrink-0">{item.time}</span>
                    <div>
                      <p className="font-medium text-slate-800">{item.label}</p>
                      {item.detail && <p className="text-sm text-slate-500">{item.detail}</p>}
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${item.type === 'medicine' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                        {item.type === 'medicine' ? 'Medicamento' : 'Consulta'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
