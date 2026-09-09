import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
  value: number
  max: number
  onChange: (value: number) => void
}

export function QuantitySelector({ value, max, onChange }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-md border" aria-label="Quantity selector">
      <Button variant="outline" className="size-9 rounded-r-none border-0" disabled={value <= 1} onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </Button>
      <span className="w-10 text-center text-sm font-medium" aria-live="polite">{value}</span>
      <Button variant="outline" className="size-9 rounded-l-none border-0" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label="Increase quantity">
        <Plus className="size-4" />
      </Button>
    </div>
  )
}
