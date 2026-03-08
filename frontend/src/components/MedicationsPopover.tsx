import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pill } from 'lucide-react'
import { fetchMedications, addMedication, deleteMedication } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="ghost"
          size={iconOnly ? 'icon' : 'default'}
          className={iconOnly ? 'size-9 hover:bg-slate-100' : 'gap-2'}
          title="Medicamentos"
        >
          <Pill size={iconOnly ? 20 : 18} />
          {!iconOnly && <span>Medicamentos ({medications.length})</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <p className="text-xs text-muted-foreground mb-2">
          Adicione medicamentos para melhorar a classificação.
        </p>
        <div className="flex gap-2 mb-3 min-w-0">
          <Input
            value={medName}
            onChange={(e) => setMedName(e.target.value)}
            placeholder="Ex: Noex, Seretide"
            className="flex-1 min-w-0"
          />
          <Button
            size="sm"
            onClick={() => medName.trim() && addMutation.mutate(medName.trim())}
            disabled={addMutation.isPending || !medName.trim()}
          >
            Adicionar
          </Button>
        </div>
        <ul className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
          {medications.map((m: { id: number; name: string }) => (
            <li
              key={m.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded text-sm"
            >
              {m.name}
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive text-lg leading-none"
                onClick={() => deleteMutation.mutate(m.id)}
                aria-label="Remover"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
