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
    <div className="grid gap-4 border-b border-slate-100 py-4 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <div>
        <p className="font-semibold text-slate-900">{item.name}</p>
        <p className="mt-0.5 text-xs text-slate-500">{formatCurrency(item.price)} each</p>
      </div>
      <QuantitySelector value={item.quantity} max={item.stock} onChange={onQuantityChange} />
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <p className="w-24 text-right font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
        <Button
          variant="outline"
          size="icon"
          className="size-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
          onClick={onRemove}
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

