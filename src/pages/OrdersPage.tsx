import { ChevronRight, Package } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { OrderStatusBadge } from "@/components/OrderStatusBadge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Order } from "@/types"

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    api.getMyOrders()
      .then((data) => active && setOrders(data))
      .catch((reason: Error) => active && setError(reason.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Your orders</h1>
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl bg-slate-200/80" />
          ))}
        </div>
      )}
      {error && <Card className="border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700 shadow-2xs">{error}</Card>}
      {!loading && !error && orders.length === 0 && (
        <Card className="p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-900 border border-slate-200">
            <Package className="size-6" />
          </div>
          <p className="text-base font-semibold text-slate-900">No orders yet</p>
          <p className="mt-1 text-xs text-slate-500">When you place orders, they will show up here.</p>
        </Card>
      )}
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} state={{ order }} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
            <Card className="flex items-center justify-between gap-4 p-5 shadow-xs border-slate-200 bg-card transition-all duration-200 group-hover:border-slate-300 group-hover:shadow-md">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="font-semibold text-slate-900">Order #{order.id.slice(0, 8)}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-xs text-slate-500">{formatDate(order.created_at)} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-slate-900">{formatCurrency(order.total_amount)}</span>
                <ChevronRight className="size-4 text-slate-400 transition-colors duration-200 group-hover:text-slate-900" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

