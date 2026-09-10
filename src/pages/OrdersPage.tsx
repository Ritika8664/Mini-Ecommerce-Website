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
    <section className="mx-auto max-w-4xl">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Your orders</h1>
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-2xl bg-slate-200/60" />
          ))}
        </div>
      )}
      {error && <Card className="border-red-200/80 bg-red-50/80 p-6 text-center text-red-700 shadow-subtle">{error}</Card>}
      {!loading && !error && orders.length === 0 && (
        <Card className="p-12 text-center shadow-subtle">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/80">
            <Package className="size-7" />
          </div>
          <p className="text-lg font-bold text-slate-900">No orders yet</p>
          <p className="mt-1 text-sm text-slate-500">When you place orders, they will show up here.</p>
        </Card>
      )}
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} state={{ order }} className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
            <Card className="flex items-center justify-between gap-4 p-6 shadow-subtle border-slate-200/80 bg-white/95 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-indigo-200/90 group-hover:shadow-card">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-bold text-slate-900">Order #{order.id.slice(0, 8)}</p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="mt-2 text-sm text-slate-500">{formatDate(order.created_at)} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-slate-900">{formatCurrency(order.total_amount)}</span>
                <ChevronRight className="size-5 text-slate-400 transition-colors duration-200 group-hover:text-indigo-600" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
