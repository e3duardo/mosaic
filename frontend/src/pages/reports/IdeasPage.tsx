import { useQuery } from '@tanstack/react-query'
import { fetchIdeas } from '../../api/client'

const colors = ['bg-amber-50 border-amber-200', 'bg-blue-50 border-blue-200', 'bg-green-50 border-green-200', 'bg-rose-50 border-rose-200', 'bg-violet-50 border-violet-200']

export function IdeasPage() {
  const { data: ideas = [], isLoading } = useQuery({ queryKey: ['ideas'], queryFn: fetchIdeas, refetchInterval: 5000 })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Ideas</h1>
      {isLoading ? (
        <p className="text-slate-500">Loading...</p>
      ) : ideas.length === 0 ? (
        <p className="text-slate-500">Nenhuma ideia encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ideas.map((idea, i) => (
            <div key={idea.id} className={`p-4 rounded-lg border-2 shadow-sm min-h-[120px] ${colors[i % colors.length]}`} style={{ transform: `rotate(${(i % 3 - 1) * 2}deg)` }}>
              <p className="text-slate-800 font-medium">{idea.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
