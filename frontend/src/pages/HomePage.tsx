import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import logo from '../assets/logo.svg'
import { TopNav } from '../components/TopNav'
import { createMessage, fetchMessages, reclassifyMessage, type Message } from '../api/client'

const CATEGORIES = ['financial', 'medical', 'ideas', 'remember', 'message_only'] as const

export function HomePage() {
  const [input, setInput] = useState('')
  const queryClient = useQueryClient()

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    refetchInterval: 2500,
  })

  const createMutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
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
      queryClient.invalidateQueries({ queryKey: ['messages'] })
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

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write anything... (e.g. Gastei 50 reais no tempero)"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
          >
            Enter
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-500">Press Enter to submit</p>
      </form>

      {(createMutation.isError || reclassifyMutation.isError) && (
        <p className="mt-4 text-red-600 text-sm">
          {(createMutation.error || reclassifyMutation.error)?.message}
        </p>
      )}

      {pendingMessages.length > 0 && (
        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-lg font-medium text-slate-700 mb-4">Processando</h2>
          <ul className="space-y-3">
            {pendingMessages.map((m) => (
              <li
                key={m.id}
                className="p-3 bg-amber-50 rounded-lg border border-amber-100 shadow-sm flex items-center gap-2"
              >
                <p className="text-slate-800 flex-1">{m.content}</p>
                <span className="text-xs text-amber-600 animate-pulse">...</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full max-w-2xl mt-12">
        <h2 className="text-lg font-medium text-slate-700 mb-4">Recent</h2>
        {isLoading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <ul className="space-y-3">
            {processedMessages.map((m: Message) => (
              <li key={m.id} className="p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                <p className="text-slate-800">{m.content}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {m.category}
                  </span>
                  <select
                    className="text-xs border border-slate-200 rounded px-2 py-1"
                    value={m.category || ''}
                    onChange={(e) => {
                      const cat = e.target.value
                      if (cat && cat !== m.category) {
                        reclassifyMutation.mutate({ id: m.id, category: cat })
                      }
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
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
