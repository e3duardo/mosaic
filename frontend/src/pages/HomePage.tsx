import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import logo from '@/assets/logo.svg'
import { TopNav } from '@/components/TopNav'
import { createMessage, reclassifyMessage } from '@/api/client'
import { useMessagesWebSocket, type Message } from '@/hooks/useMessagesWebSocket'
import { useAI } from '@/contexts/AIContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = ['financial', 'medical', 'ideas', 'remember', 'message_only'] as const

export function HomePage() {
  const [input, setInput] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const queryClient = useQueryClient()
  const { messages, isLoading } = useMessagesWebSocket()
  const { useAI: useAIEnabled } = useAI()

  const createMutation = useMutation({
    mutationFn: (content: string) => createMessage(content, useAIEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['earnings'] })
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
    },
  })

  const reclassifyMutation = useMutation({
    mutationFn: ({ id, category }: { id: number; category: string }) =>
      reclassifyMessage(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['earnings'] })
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed) {
      setInput('')
      createMutation.mutate(trimmed)
    }
  }

  const pendingMessages = messages.filter((m) => (m.status ?? 'processed') === 'pending')
  const processedMessages = messages.filter((m) => (m.status ?? 'processed') === 'processed')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 px-4 pb-16 relative">
      <TopNav variant="minimal" />
      <img src={logo} alt="" className="w-20 h-20 mb-4" />
      <h1 className="text-4xl font-bold mb-12 caveat-title" style={{ color: '#1C3F6B' }}>
        Mosaic
      </h1>

      <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write anything... (e.g. Gastei 50 reais no tempero)"
            className="flex-1 min-h-[44px] resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                formRef.current?.requestSubmit()
              }
            }}
          />
          <Button type="submit" disabled={!input.trim()} size="lg" className="bg-slate-800 hover:bg-slate-700 text-white shrink-0">
            Enter
          </Button>
        </div>
        <p className="mt-2 text-sm text-slate-500">Enter para enviar · Shift+Enter para nova linha</p>
      </form>

      {(createMutation.isError || reclassifyMutation.isError) && (
        <p className="mt-4 text-destructive text-sm">
          {(createMutation.error || reclassifyMutation.error)?.message}
        </p>
      )}

      {pendingMessages.length > 0 && (
        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-lg font-medium text-foreground mb-4">Processando</h2>
          <ul className="space-y-3">
            {pendingMessages.map((m) => (
              <li key={m.id} className="p-3 bg-amber-50 rounded-lg border border-amber-100 shadow-sm flex items-center gap-2">
                <p className="text-slate-800 flex-1">{m.content}</p>
                <span className="text-xs text-amber-600 animate-pulse">...</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full max-w-2xl mt-12">
        <h2 className="text-lg font-medium text-foreground mb-4">Recent</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <ul className="space-y-3">
            {processedMessages.map((m: Message) => (
              <li key={m.id} className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                <p className="text-slate-800">{m.content}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{m.category}</Badge>
                    <Select
                      value={m.category || ''}
                      onValueChange={(cat) => {
                        if (cat && cat !== m.category) {
                          reclassifyMutation.mutate({ id: m.id, category: cat })
                        }
                      }}
                    >
                      <SelectTrigger className="w-fit h-7 text-xs">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {reclassifyMutation.isPending && reclassifyMutation.variables?.id === m.id && (
                      <span className="text-xs text-slate-400">...</span>
                    )}
                  </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
