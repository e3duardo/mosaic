import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMedicines, fetchAppointments, fetchMessages } from '@/api/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function formatDateTime(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return { date: d.toLocaleDateString('pt-BR'), time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }
  } catch {
    return { date: dateStr, time: '' }
  }
}

export function MedicamentosPage() {
  const { data: medicines = [], isLoading: lm } = useQuery({ queryKey: ['medicines'], queryFn: fetchMedicines, refetchInterval: 5000 })
  const { data: appointments = [], isLoading: la } = useQuery({ queryKey: ['appointments'], queryFn: fetchAppointments, refetchInterval: 5000 })
  const { data: fallbackMessages = [], isLoading: lmsg } = useQuery({
    queryKey: ['messages', 'medical'],
    queryFn: () => fetchMessages('medical'),
    refetchInterval: 5000,
    enabled: !lm && !la && medicines.length === 0 && appointments.length === 0,
  })

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

  const showFallback = items.length === 0 && fallbackMessages.length > 0

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Medicamentos</h1>
      {lm || la ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items.length === 0 && !showFallback ? (
        lmsg ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <p className="text-muted-foreground">Nenhum registro encontrado.</p>
        )
      ) : showFallback ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-4">Mensagens com categoria medical (sem artefatos extraídos):</p>
          {fallbackMessages.map((m) => (
            <Card key={m.id}>
              <CardContent className="py-4">
                <p className="text-foreground">{m.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <Card key={date}>
              <div className="px-4 py-2 bg-muted/50 border-b border-border font-medium text-foreground">
                {date}
              </div>
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {(byDate.get(date) || []).map((item, i) => (
                    <li key={i} className="px-4 py-3 flex items-start gap-3">
                      <span className="text-sm text-muted-foreground shrink-0">{item.time}</span>
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        {item.detail && <p className="text-sm text-muted-foreground">{item.detail}</p>}
                        <Badge
                          variant={item.type === 'medicine' ? 'default' : 'secondary'}
                          className="mt-1"
                        >
                          {item.type === 'medicine' ? 'Medicamento' : 'Consulta'}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
