import { useRef, useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import logo from '@/assets/logo.svg'
import { TopNav } from '@/components/TopNav'
import { createMessage, reclassifyMessage } from '@/api/client'
import { useMessagesWebSocket, type Message } from '@/hooks/useMessagesWebSocket'
import { useAI } from '@/contexts/AIContext'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

const textareaClasses =
  'min-h-[44px] w-full rounded-lg border border-slate-200 bg-white text-base outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm box-border'

const CATEGORIES = ['financial', 'medical', 'ideas', 'remember', 'message_only'] as const

function CategorySelectPopover({
  category,
  onSelect,
  isPending,
  error,
}: {
  category: string
  onSelect: (cat: string) => void
  isPending?: boolean
  error?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isPending}>
        <button
          type="button"
          className="inline-flex items-center gap-1 cursor-pointer border-0 bg-transparent p-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Badge variant="secondary" className="gap-1 pr-1">
            {category}
            <Pencil size={12} />
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2 bg-white">
        <Select
          value={category || ''}
          onValueChange={(cat) => {
            if (cat && cat !== category) {
              onSelect(cat)
              setOpen(false)
            }
          }}
        >
          <SelectTrigger className="w-40 h-8 text-xs">
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
      </PopoverContent>
      {(isPending || error) && (
        <div className="mt-1 flex items-center gap-2">
          {isPending && <span className="text-xs text-amber-600 animate-pulse">Salvando...</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      )}
    </Popover>
  )
}

function AutoResizeTextarea(props: React.ComponentProps<'textarea'>) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [props.value])
  return <textarea ref={ref} className={cn(textareaClasses, props.className)} {...props} />
}

export function HomePage() {
  const [input, setInput] = useState('')
  const [optimisticPending, setOptimisticPending] = useState<{ content: string }[]>([])
  const [reclassifyErrors, setReclassifyErrors] = useState<Record<number, string>>({})
  const [reclassifyPending, setReclassifyPending] = useState<Record<number, string>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const queryClient = useQueryClient()
  const { messages, isLoading } = useMessagesWebSocket()
  const { useAI: useAIEnabled, setUseAI } = useAI()

  useEffect(() => {
    if (messages.length === 0) return
    setOptimisticPending((prev) =>
      prev.filter((o) => !messages.some((m) => m.content === o.content))
    )
  }, [messages])

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
    onError: (_, content) => {
      setOptimisticPending((prev) => prev.filter((o) => o.content !== content))
    },
  })

  const reclassifyMutation = useMutation({
    mutationFn: ({ id, category }: { id: number; category: string }) =>
      reclassifyMessage(id, category),
    onSuccess: (_, variables) => {
      setReclassifyErrors((prev) => {
        const next = { ...prev }
        delete next[variables.id]
        return next
      })
      setReclassifyPending((prev) => {
        const next = { ...prev }
        delete next[variables.id]
        return next
      })
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['earnings'] })
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
    },
    onError: (err, variables) => {
      setReclassifyPending((prev) => {
        const next = { ...prev }
        delete next[variables.id]
        return next
      })
      setReclassifyErrors((prev) => ({
        ...prev,
        [variables.id]: err instanceof Error ? err.message : String(err),
      }))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed) {
      setInput('')
      setOptimisticPending((prev) => [...prev, { content: trimmed }])
      createMutation.mutate(trimmed)
    }
  }

  const pendingMessages = [
    ...optimisticPending.map((o) => ({ id: -1, content: o.content, category: '', status: 'pending' as const })),
    ...messages.filter((m) => (m.status ?? 'processed') === 'pending'),
  ]
  const processedMessages = messages.filter((m) => (m.status ?? 'processed') === 'processed')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 px-4 pb-16 relative">
      <TopNav variant="minimal" />
      <img src={logo} alt="" className="w-20 h-20 mb-4" />
      <h1 className="text-4xl font-bold mb-12 caveat-title" style={{ color: '#1C3F6B' }}>
        Mosaic
      </h1>

      <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="flex gap-2 items-start">
          <AutoResizeTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write anything... (e.g. Gastei 50 reais no tempero)"
            className="flex-1 min-h-[44px] resize-none p-4"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                formRef.current?.requestSubmit()
              }
            }}
          />
          <div className="flex flex-col gap-2 items-center shrink-0">
            <Button type="submit" disabled={!input.trim()} size="lg" className="bg-slate-800 hover:bg-slate-700 text-white w-full">
              Enter
            </Button>
            <div className="flex items-center gap-2">
              <Switch id="ia" checked={useAIEnabled} onCheckedChange={setUseAI} />
              <Label htmlFor="ia" className="cursor-pointer text-sm font-normal text-slate-600">
                IA
              </Label>
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-500">Enter para enviar · Shift+Enter para nova linha</p>
      </form>

      {createMutation.isError && (
        <p className="mt-4 text-destructive text-sm">
          {createMutation.error?.message}
        </p>
      )}

      {pendingMessages.length > 0 && (
        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-lg font-medium text-foreground mb-4">Processando</h2>
          <ul className="space-y-3">
            {pendingMessages.map((m, i) => (
              <li key={m.id >= 0 ? m.id : `opt-${i}-${m.content}`} className="p-3 bg-amber-50 rounded-lg border border-amber-100 shadow-sm flex items-center gap-2">
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
                  <CategorySelectPopover
                    category={reclassifyPending[m.id] ?? m.category}
                    onSelect={(cat) => {
                      setReclassifyErrors((prev) => {
                        const next = { ...prev }
                        delete next[m.id]
                        return next
                      })
                      setReclassifyPending((prev) => ({ ...prev, [m.id]: cat }))
                      reclassifyMutation.mutate({ id: m.id, category: cat })
                    }}
                    isPending={!!reclassifyPending[m.id]}
                    error={reclassifyErrors[m.id]}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
