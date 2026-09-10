import { Trash2 } from "lucide-react"

import { QuantitySelector } from "@/components/QuantitySelector"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import type { CartItem } from "@/types"

interface CartItemRowProps {
  item: CartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <div className="grid gap-4 border-b border-slate-100 py-5 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <div>
        <p className="font-semibold text-slate-900">{item.name}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">{formatCurrency(item.price)} each</p>
      </div>
      <QuantitySelector value={item.quantity} max={item.stock} onChange={onQuantityChange} />
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <p className="w-24 text-right font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
        <Button
          variant="outline"
          className="size-9 rounded-lg border border-slate-200/80 bg-white px-0 text-rose-600 shadow-2xs hover:border-rose-200 hover:bg-rose-50/90 hover:text-rose-700"
          onClick={onRemove}
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}
