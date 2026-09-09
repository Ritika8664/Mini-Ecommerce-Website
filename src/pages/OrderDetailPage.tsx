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

  if (loading) return <Skeleton className="mx-auto h-96 max-w-3xl" />
  if (error || !order) return <Card className="mx-auto max-w-xl p-8 text-center text-red-600">{error || "Order not found"}</Card>

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
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <p className="font-semibold">Order placed successfully</p>
          <p className="mt-1 break-all text-sm">Order ID: {order.id} · Status: pending</p>
        </div>
      )}
      {redirectStatus === "success" && order.status === "pending" && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
          Payment submitted. Waiting for confirmation from Razorpay...
        </div>
      )}
      {redirectStatus === "success" && order.status === "paid" && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          Payment successful. Your order is paid.
        </div>
      )}
      {redirectStatus === "success" && order.status === "failed" && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          Payment failed. Your order was not paid.
        </div>
      )}
      {redirectStatus === "cancelled" && (
        <div className="mb-5 rounded-lg border border-slate-200 bg-slate-100 p-4 text-slate-700">
          Checkout was cancelled. Your order remains pending.
        </div>
      )}
      <Button asChild variant="outline" size="sm" className="mb-5"><Link to="/orders">Back to orders</Link></Button>
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div><CardTitle className="text-2xl">Order #{order.id.slice(0, 8)}</CardTitle><p className="mt-2 text-sm text-slate-500">Placed {formatDate(order.created_at)}</p></div>
          <OrderStatusBadge status={order.status} />
        </CardHeader>
        <CardContent>
          <div className="divide-y border-y">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 py-4">
                <div><p className="font-medium">Product #{item.product_id.slice(0, 8)}</p><p className="text-sm text-slate-500">Quantity: {item.quantity} · {formatCurrency(item.unit_price)} each</p></div>
                <p className="font-semibold">{formatCurrency(Number(item.unit_price) * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-6 text-xl font-bold"><span>Total</span><span>{formatCurrency(order.total_amount)}</span></div>
          {paymentError && <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{paymentError}</p>}
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
