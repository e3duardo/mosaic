import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pill } from 'lucide-react'
import { fetchMedications, addMedication, deleteMedication } from '../api/client'

type Props = { iconOnly?: boolean }

export function MedicationsPopover({ iconOnly = false }: Props) {
  const [open, setOpen] = useState(false)
  const [medName, setMedName] = useState('')
  const queryClient = useQueryClient()
  const { data: medications = [] } = useQuery({
    queryKey: ['medications'],
    queryFn: fetchMedications,
  })
  const addMutation = useMutation({
    mutationFn: addMedication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      setMedName('')
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteMedication,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medications'] }),
  })

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center rounded-lg text-slate-600 hover:bg-slate-100 text-sm transition-colors ${
          iconOnly ? 'justify-center w-9 h-9' : 'gap-2 px-3 py-2'
        }`}
        title="Medicamentos"
      >
        <Pill size={iconOnly ? 20 : 18} />
        {!iconOnly && <span>Medicamentos ({medications.length})</span>}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-72 p-4 bg-white rounded-lg border border-slate-200 shadow-lg z-50 overflow-hidden">
            <p className="text-xs text-slate-500 mb-2">Adicione medicamentos para melhorar a classificação.</p>
            <div className="flex gap-2 mb-3 min-w-0">
              <input
                type="text"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="Ex: Noex, Seretide"
                className="flex-1 min-w-0 px-3 py-2 text-sm rounded border border-slate-200"
              />
              <button
                type="button"
                onClick={() => medName.trim() && addMutation.mutate(medName.trim())}
                disabled={addMutation.isPending || !medName.trim()}
                className="shrink-0 px-3 py-2 text-sm bg-slate-700 text-white rounded hover:bg-slate-600"
              >
                Adicionar
              </button>
            </div>
            <ul className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {medications.map((m: { id: number; name: string }) => (
                <li key={m.id} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-sm">
                  {m.name}
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(m.id)}
                    className="text-slate-400 hover:text-red-600"
                    aria-label="Remover"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
