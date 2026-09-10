import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
  value: number
  max: number
  onChange: (value: number) => void
}

export function QuantitySelector({ value, max, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200/90 bg-white/90 p-0.5 shadow-2xs" aria-label="Quantity selector">
      <Button
        variant="outline"
        className="size-8 rounded-lg border-0 bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-1"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </Button>
      <span className="w-10 text-center text-sm font-semibold text-slate-900 select-none" aria-live="polite">{value}</span>
      <Button
        variant="outline"
        className="size-8 rounded-lg border-0 bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-1"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  )
}
