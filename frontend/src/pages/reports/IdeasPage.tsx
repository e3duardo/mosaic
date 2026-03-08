import { useQuery } from '@tanstack/react-query'
import { fetchIdeas, fetchMessages } from '@/api/client'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const colorClasses = [
  'bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800',
  'bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800',
  'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800',
  'bg-rose-50 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800',
  'bg-violet-50 border-violet-200 dark:bg-violet-950/50 dark:border-violet-800',
]

export function IdeasPage() {
  const { data: ideas = [], isLoading: li } = useQuery({ queryKey: ['ideas'], queryFn: fetchIdeas, refetchInterval: 5000 })
  const { data: fallbackMessages = [], isLoading: lm } = useQuery({
    queryKey: ['messages', 'ideas'],
    queryFn: () => fetchMessages('ideas'),
    refetchInterval: 5000,
    enabled: !li && ideas.length === 0,
  })

  const showFallback = ideas.length === 0 && fallbackMessages.length > 0

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Ideas</h1>
      {li ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : ideas.length === 0 && !showFallback ? (
        lm ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <p className="text-muted-foreground">Nenhuma ideia encontrada.</p>
        )
      ) : showFallback ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">Mensagens com categoria ideas (sem artefatos extraídos):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fallbackMessages.map((m, i) => (
              <Card
                key={m.id}
                className={cn('min-h-[120px] border-2 shadow-sm', colorClasses[i % colorClasses.length])}
                style={{ transform: `rotate(${(i % 3 - 1) * 2}deg)` }}
              >
                <CardContent className="py-4">
                  <p className="text-foreground font-medium">{m.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ideas.map((idea, i) => (
            <Card
              key={idea.id}
              className={cn(
                'min-h-[120px] border-2 shadow-sm',
                colorClasses[i % colorClasses.length]
              )}
              style={{ transform: `rotate(${(i % 3 - 1) * 2}deg)` }}
            >
              <CardContent className="py-4">
                <p className="text-foreground font-medium">{idea.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
