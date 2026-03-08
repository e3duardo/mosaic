import { useQuery } from '@tanstack/react-query'
import { fetchExpenses, fetchEarnings } from '../../api/client'

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
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Financial</h1>
      {le || la ? (
        <p className="text-slate-500">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-slate-500">Nenhum registro encontrado.</p>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-medium text-slate-700">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-slate-700">Valor</th>
                <th className="text-left px-4 py-3 font-medium text-slate-700">Descrição</th>
                <th className="text-left px-4 py-3 font-medium text-slate-700">Conta</th>
                <th className="text-left px-4 py-3 font-medium text-slate-700">Data</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <span className={row.type === 'Despesa' ? 'text-red-600' : 'text-green-600'}>{row.type}</span>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {row.type === 'Despesa' ? formatCurrency(Math.abs(row.amount)) : formatCurrency(row.amount)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.description}</td>
                  <td className="px-4 py-3 text-slate-600">{row.account || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(row.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
