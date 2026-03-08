import { useEffect, useState } from 'react'

export type Message = {
  id: number
  content: string
  category: string
  status?: 'pending' | 'processed'
  created_at?: string
}

type WsPayload = {
  type: 'messages'
  data: Message[]
}

function getWsUrl(): string {
  const base = import.meta.env.VITE_API_URL || ''
  if (base) {
    const url = new URL(base)
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${url.host}/api/ws`
  }
  const { protocol, host } = window.location
  const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:'
  return `${wsProtocol}//${host}/api/ws`
}

export function useMessagesWebSocket() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const url = getWsUrl()
    const ws = new WebSocket(url)

    ws.onopen = () => {
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const payload: WsPayload = JSON.parse(event.data)
        if (payload.type === 'messages' && Array.isArray(payload.data)) {
          setMessages(
            payload.data.map((m) => ({
              ...m,
              status: (m.status ?? 'processed') as 'pending' | 'processed',
            }))
          )
        }
      } catch {
        // ignore parse errors
      }
      setIsLoading(false)
    }

    ws.onclose = () => {
      setIsConnected(false)
      setIsLoading(false)
    }

    ws.onerror = () => {
      setIsLoading(false)
    }

    return () => {
      ws.close()
    }
  }, [])

  return { messages, isConnected, isLoading }
}
