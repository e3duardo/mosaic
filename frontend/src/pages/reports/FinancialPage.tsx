import { useQuery } from '@tanstack/react-query'
import { fetchExpenses, fetchEarnings } from '@/api/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'

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

export function FinancialPage() {
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

  const rows = [
    ...expenses.map((e) => ({ type: 'Despesa' as const, amount: -e.amount, description: e.description, account: e.account, date: e.date })),
    ...earnings.map((e) => ({ type: 'Ganho' as const, amount: e.amount, description: e.description, account: e.account, date: e.date })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Financial</h1>
      {le || la ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground">Nenhum registro encontrado.</p>
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
    </div>
  )
}
