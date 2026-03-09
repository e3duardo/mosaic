import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchExpenses,
  fetchEarnings,
  fetchMessages,
  fetchFinancialCategories,
  createFinancialCategory,
  updateFinancialCategory,
  deleteFinancialCategory,
  fetchAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '@/api/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR')
  } catch {
    return dateStr
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function CrudList({
  title,
  items,
  onAdd,
  onUpdate,
  onDelete,
  addPending,
  placeholder,
}: {
  title: string
  items: { id: number; name: string }[]
  onAdd: (name: string) => void
  onUpdate: (id: number, name: string) => void
  onDelete: (id: number) => void
  addPending: boolean
  placeholder: string
}) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const handleAdd = () => {
    const t = newName.trim()
    if (t) {
      onAdd(t)
      setNewName('')
    }
  }

  const startEdit = (id: number, name: string) => {
    setEditingId(id)
    setEditName(name)
  }

  const saveEdit = () => {
    if (editingId !== null && editName.trim()) {
      onUpdate(editingId, editName.trim())
      setEditingId(null)
      setEditName('')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
        <div className="flex gap-2 mb-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-w-0"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button size="sm" onClick={handleAdd} disabled={addPending || !newName.trim()}>
            Adicionar
          </Button>
        </div>
        <ul className="space-y-2 max-h-40 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 text-sm">
              {editingId === item.id ? (
                <>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 h-8 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={saveEdit}>
                    Salvar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-foreground">{item.name}</span>
                  <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => startEdit(item.id, item.name)}>
                    Editar
                  </Button>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive text-lg leading-none p-0 border-0 bg-transparent cursor-pointer"
                    onClick={() => onDelete(item.id)}
                    aria-label="Remover"
                  >
                    ×
                  </button>
                </>
              )}
            </li>
          ))}
          {items.length === 0 && (
            <li className="text-sm text-muted-foreground">Nenhum item cadastrado.</li>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}

export function FinancialPage() {
  const queryClient = useQueryClient()
  const { data: expenses = [], isLoading: le } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
    refetchInterval: 5000,
  })
  const { data: earnings = [], isLoading: la } = useQuery({
    queryKey: ['earnings'],
    queryFn: fetchEarnings,
    refetchInterval: 5000,
  })
  const { data: fallbackMessages = [], isLoading: lm } = useQuery({
    queryKey: ['messages', 'financial'],
    queryFn: () => fetchMessages('financial'),
    refetchInterval: 5000,
    enabled: !le && !la && expenses.length === 0 && earnings.length === 0,
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['financialCategories'],
    queryFn: fetchFinancialCategories,
    refetchInterval: 5000,
  })
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
    refetchInterval: 5000,
  })

  const createCatMutation = useMutation({
    mutationFn: createFinancialCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['financialCategories'] }),
  })
  const updateCatMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateFinancialCategory(id, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['financialCategories'] }),
  })
  const deleteCatMutation = useMutation({
    mutationFn: deleteFinancialCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['financialCategories'] }),
  })

  const createAccMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  })
  const updateAccMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateAccount(id, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  })
  const deleteAccMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  })

  const rows = [
    ...expenses.map((e) => ({ type: 'Despesa' as const, amount: -e.amount, description: e.description, account: e.account, date: e.date })),
    ...earnings.map((e) => ({ type: 'Ganho' as const, amount: e.amount, description: e.description, account: e.account, date: e.date })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const showFallback = rows.length === 0 && fallbackMessages.length > 0

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Financial</h1>
      {le || la ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : rows.length === 0 && !showFallback ? (
        lm ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <p className="text-muted-foreground">Nenhum registro encontrado.</p>
        )
      ) : showFallback ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-4">Mensagens com categoria financial (sem artefatos extraídos):</p>
          {fallbackMessages.map((m) => (
            <Card key={m.id}>
              <CardContent className="py-3">
                <p className="text-foreground">{m.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Conta</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <span className={row.type === 'Despesa' ? 'text-destructive' : 'text-green-600'}>
                        {row.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono">
                      {row.type === 'Despesa' ? formatCurrency(Math.abs(row.amount)) : formatCurrency(row.amount)}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell className="text-muted-foreground">{row.account || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(row.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <CrudList
          title="Categorias"
          items={categories}
          onAdd={(name) => createCatMutation.mutate(name)}
          onUpdate={(id, name) => updateCatMutation.mutate({ id, name })}
          onDelete={(id) => deleteCatMutation.mutate(id)}
          addPending={createCatMutation.isPending}
          placeholder="Ex: alimentação, transporte"
        />
        <CrudList
          title="Contas bancárias"
          items={accounts}
          onAdd={(name) => createAccMutation.mutate(name)}
          onUpdate={(id, name) => updateAccMutation.mutate({ id, name })}
          onDelete={(id) => deleteAccMutation.mutate(id)}
          addPending={createAccMutation.isPending}
          placeholder="Ex: conta corrente, poupança"
        />
      </div>
    </div>
  )
}
