import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types"

const colors: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-red-200 bg-red-50 text-red-700",
  cancelled: "border-slate-200 bg-slate-100 text-slate-600",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant="outline" className={cn("capitalize", colors[status])}>{status}</Badge>
}
