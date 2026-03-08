import { useQuery } from '@tanstack/react-query'
import { fetchReminders } from '@/api/client'
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
  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['reminders'],
    queryFn: fetchReminders,
    refetchInterval: 5000,
  })
  const sorted = [...reminders].sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime())

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Remember</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : reminders.length === 0 ? (
        <p className="text-muted-foreground">Nenhum lembrete encontrado.</p>
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
