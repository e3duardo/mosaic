const API_URL = import.meta.env.VITE_API_URL || ''

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export type Message = {
  id: number
  content: string
  category: string
  status?: 'pending' | 'processed'
}

export async function createMessage(content: string, useAI = true) {
  return fetchApi<Message>('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ content, use_ai: useAI }),
  })
}
export async function fetchMessages(category?: string) {
  const url = category ? `/api/messages?category=${encodeURIComponent(category)}` : '/api/messages'
  return fetchApi<Message[]>(url)
}
export async function reclassifyMessage(id: number, category: string) {
  return fetchApi(`/api/messages/${id}/reclassify`, {
    method: 'POST',
    body: JSON.stringify({ category }),
  })
}
export async function fetchMedications() {
  return fetchApi<{ id: number; name: string }[]>('/api/medical/medications')
}
export async function addMedication(name: string) {
  return fetchApi<{ id: number }>('/api/medical/medications', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}
export async function deleteMedication(id: number) {
  const res = await fetch(`${API_URL}/api/medical/medications/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
}
export async function fetchExpenses() {
  return fetchApi<{ id: number; amount: number; description: string; account: string; date: string }[]>(
    '/api/financial/expenses'
  )
}
export async function fetchEarnings() {
  return fetchApi<{ id: number; amount: number; description: string; account: string; date: string }[]>(
    '/api/financial/earnings'
  )
}
export async function fetchMedicines() {
  return fetchApi<{ id: number; name: string; quantity: number; taken_at: string }[]>(
    '/api/medical/medicines'
  )
}
export async function fetchAppointments() {
  return fetchApi<{ id: number; description: string; scheduled_at: string }[]>(
    '/api/medical/appointments'
  )
}
export async function fetchIdeas() {
  return fetchApi<{ id: number; content: string }[]>('/api/ideas')
}
export async function fetchReminders() {
  return fetchApi<{ id: number; content: string; due_at: string }[]>('/api/remember')
}

export type FinancialCategory = { id: number; name: string }
export async function fetchFinancialCategories() {
  return fetchApi<FinancialCategory[]>('/api/financial/categories')
}
export async function createFinancialCategory(name: string) {
  return fetchApi<FinancialCategory>('/api/financial/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}
export async function updateFinancialCategory(id: number, name: string) {
  return fetchApi<FinancialCategory>(`/api/financial/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })
}
export async function deleteFinancialCategory(id: number) {
  const res = await fetch(`${API_URL}/api/financial/categories/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
}

export type Account = { id: number; name: string }
export async function fetchAccounts() {
  return fetchApi<Account[]>('/api/financial/accounts')
}
export async function createAccount(name: string) {
  return fetchApi<Account>('/api/financial/accounts', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}
export async function updateAccount(id: number, name: string) {
  return fetchApi<Account>(`/api/financial/accounts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })
}
export async function deleteAccount(id: number) {
  const res = await fetch(`${API_URL}/api/financial/accounts/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
}
