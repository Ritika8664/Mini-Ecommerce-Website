import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types"

const colors: Record<OrderStatus, string> = {
  pending: "border-amber-200/90 bg-amber-50/90 text-amber-800 font-semibold shadow-2xs",
  paid: "border-emerald-200/90 bg-emerald-50/90 text-emerald-800 font-semibold shadow-2xs",
  failed: "border-rose-200/90 bg-rose-50/90 text-rose-700 font-semibold shadow-2xs",
  cancelled: "border-slate-200/90 bg-slate-100/90 text-slate-700 font-semibold shadow-2xs",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant="outline" className={cn("capitalize px-2.5 py-0.5 text-xs", colors[status])}>{status}</Badge>
}
