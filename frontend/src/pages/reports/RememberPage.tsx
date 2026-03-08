import { useQuery } from '@tanstack/react-query'
import { fetchReminders, fetchMessages } from '@/api/client'
import { Card, CardContent } from '@/components/ui/card'

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export function RememberPage() {
  const { data: reminders = [], isLoading: lr } = useQuery({
    queryKey: ['reminders'],
    queryFn: fetchReminders,
    refetchInterval: 5000,
  })
  const { data: fallbackMessages = [], isLoading: lm } = useQuery({
    queryKey: ['messages', 'remember'],
    queryFn: () => fetchMessages('remember'),
    refetchInterval: 5000,
    enabled: !lr && reminders.length === 0,
  })

  const sorted = [...reminders].sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime())
  const showFallback = reminders.length === 0 && fallbackMessages.length > 0

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Remember</h1>
      {lr ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : reminders.length === 0 && !showFallback ? (
        lm ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <p className="text-muted-foreground">Nenhum lembrete encontrado.</p>
        )
      ) : showFallback ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-4">Mensagens com categoria remember (sem artefatos extraídos):</p>
          {fallbackMessages.map((m) => (
            <Card key={m.id}>
              <CardContent className="py-4">
                <p className="text-foreground">{m.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {sorted.map((r) => (
            <Card key={r.id}>
              <CardContent className="py-4 flex items-center gap-4">
                <span className="text-sm text-muted-foreground shrink-0">{formatDate(r.due_at)}</span>
                <p className="text-foreground">{r.content}</p>
              </CardContent>
            </Card>
          ))}
        </ul>
      )}
    </div>
  )
}
