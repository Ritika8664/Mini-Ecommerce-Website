import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types"

const colors: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-900 font-medium",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-900 font-medium",
  failed: "border-rose-200 bg-rose-50 text-rose-900 font-medium",
  cancelled: "border-slate-200 bg-slate-100 text-slate-700 font-medium",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant="outline" className={cn("capitalize px-2.5 py-0.5 text-xs rounded-full shadow-2xs", colors[status])}>{status}</Badge>
}

