import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"

import { OrderStatusBadge } from "@/components/OrderStatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { openRazorpayCheckout } from "@/lib/razorpay"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Order } from "@/types"

export function OrderDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const redirectStatus = searchParams.get("status")
  const routeState = location.state as { order?: Order; justCreated?: boolean } | null
  const stateOrder = routeState?.order
  const [order, setOrder] = useState<Order | null>(stateOrder?.id === id ? (stateOrder ?? null) : null)
  const [loading, setLoading] = useState(!order)
  const [error, setError] = useState("")
  const [startingPayment, setStartingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  useEffect(() => {
    if (order) return
    if (!id) {
      setError("Order not found")
      setLoading(false)
      return
    }
    let active = true
    api.getOrder(id)
      .then((found) => active && setOrder(found))
      .catch((reason: Error) => active && setError(reason.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id, order])

  useEffect(() => {
    if (redirectStatus !== "success" || !id) return
    let active = true
    let attempts = 0
    let timeoutId: number | undefined

    const refreshStatus = async () => {
      try {
        const refreshedOrder = await api.getOrder(id)
        if (!active) return
        setOrder(refreshedOrder)
        attempts += 1
        if (refreshedOrder.status === "pending" && attempts < 8) {
          timeoutId = window.setTimeout(() => void refreshStatus(), 1500)
        }
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : "Could not refresh order")
      }
    }

    void refreshStatus()
    return () => {
      active = false
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [id, redirectStatus])

  if (loading) return <Skeleton className="mx-auto h-96 max-w-3xl rounded-2xl bg-slate-200/60" />
  if (error || !order) return <Card className="mx-auto max-w-xl p-10 text-center font-medium text-red-600 shadow-subtle">{error || "Order not found"}</Card>

  const handlePayment = async () => {
    setStartingPayment(true)
    setPaymentError("")
    try {
      if (!user) throw new Error("Sign in before paying")
      const session = await api.createCheckoutSession(order.id)
      openRazorpayCheckout({
        session,
        user,
        onSuccess: async (payment) => {
          try {
            const paidOrder = await api.verifyPayment(payment)
            setOrder(paidOrder)
            navigate(`/orders/${paidOrder.id}?status=success`, {
              replace: true,
              state: { order: paidOrder },
            })
            setStartingPayment(false)
          } catch (reason) {
            setPaymentError(reason instanceof Error ? reason.message : "Payment verification failed")
            setStartingPayment(false)
          }
        },
        onDismiss: () => {
          setPaymentError("Payment cancelled. Your order remains pending.")
          setStartingPayment(false)
        },
        onFailure: () => {
          setPaymentError("Payment failed. Your order remains pending.")
          setStartingPayment(false)
        },
      })
    } catch (reason) {
      setPaymentError(reason instanceof Error ? reason.message : "Could not start checkout")
      setStartingPayment(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      {routeState?.justCreated && (
        <div className="mb-6 rounded-2xl border border-emerald-200/90 bg-emerald-50/90 p-5 text-emerald-800 shadow-2xs">
          <p className="font-bold text-base">Order placed successfully</p>
          <p className="mt-1 break-all text-sm font-medium opacity-90">Order ID: {order.id} · Status: pending</p>
        </div>
      )}
      {redirectStatus === "success" && order.status === "pending" && (
        <div className="mb-6 rounded-2xl border border-amber-200/90 bg-amber-50/90 p-5 text-amber-800 shadow-2xs font-medium">
          Payment submitted. Waiting for confirmation from Razorpay...
        </div>
      )}
      {redirectStatus === "success" && order.status === "paid" && (
        <div className="mb-6 rounded-2xl border border-emerald-200/90 bg-emerald-50/90 p-5 text-emerald-800 shadow-2xs font-medium">
          Payment successful. Your order is paid.
        </div>
      )}
      {redirectStatus === "success" && order.status === "failed" && (
        <div className="mb-6 rounded-2xl border border-rose-200/90 bg-rose-50/90 p-5 text-rose-700 shadow-2xs font-medium">
          Payment failed. Your order was not paid.
        </div>
      )}
      {redirectStatus === "cancelled" && (
        <div className="mb-6 rounded-2xl border border-slate-200/90 bg-slate-100/90 p-5 text-slate-700 shadow-2xs font-medium">
          Checkout was cancelled. Your order remains pending.
        </div>
      )}
      <Button asChild variant="outline" size="sm" className="mb-6"><Link to="/orders">← Back to orders</Link></Button>
      <Card className="shadow-subtle border-slate-200/80 bg-white/95">
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-6 border-b border-slate-100">
          <div>
            <CardTitle className="text-2xl font-extrabold text-slate-900">Order #{order.id.slice(0, 8)}</CardTitle>
            <p className="mt-1 text-sm font-medium text-slate-500">Placed {formatDate(order.created_at)}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="divide-y divide-slate-100 border-b border-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">Product #{item.product_id.slice(0, 8)}</p>
                  <p className="text-sm text-slate-500">Quantity: {item.quantity} · {formatCurrency(item.unit_price)} each</p>
                </div>
                <p className="font-bold text-slate-900">{formatCurrency(Number(item.unit_price) * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-6 text-xl font-extrabold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
          {paymentError && <p className="mt-5 rounded-xl border border-red-200/90 bg-red-50/90 p-4 text-sm font-medium text-red-700">{paymentError}</p>}
          {order.status === "pending" && (
            <Button className="mt-6 w-full" size="lg" disabled={startingPayment} onClick={() => void handlePayment()}>
              {startingPayment ? "Opening secure checkout..." : redirectStatus === "cancelled" ? "Try payment again" : "Pay now"}
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
