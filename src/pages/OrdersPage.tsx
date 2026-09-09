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
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Your orders</h1>
      {loading && <div className="space-y-4">{Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-28" />)}</div>}
      {error && <Card className="p-6 text-center text-red-600">{error}</Card>}
      {!loading && !error && orders.length === 0 && <Card className="p-10 text-center"><Package className="mx-auto size-10 text-slate-400" /><p className="mt-4 font-semibold">No orders yet</p></Card>}
      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} state={{ order }} className="block">
            <Card className="flex items-center justify-between gap-4 p-5 transition hover:shadow-md">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3"><p className="font-semibold">Order #{order.id.slice(0, 8)}</p><OrderStatusBadge status={order.status} /></div>
                <p className="mt-2 text-sm text-slate-500">{formatDate(order.created_at)} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
              </div>
              <div className="flex items-center gap-3"><span className="font-bold">{formatCurrency(order.total_amount)}</span><ChevronRight className="size-5 text-slate-400" /></div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
