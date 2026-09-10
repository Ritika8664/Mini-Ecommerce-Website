import { CreditCard } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { openRazorpayCheckout } from "@/lib/razorpay"
import { formatCurrency } from "@/lib/utils"

export function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)

  const handlePayNow = async () => {
    setSubmitting(true)
    setError("")
    try {
      if (!user) throw new Error("Sign in before paying")
      let orderId = pendingOrderId
      if (!orderId) {
        const order = await api.createOrder(
          items.map((item) => ({ product_id: item.productId, quantity: item.quantity })),
        )
        orderId = order.id
        setPendingOrderId(order.id)
      }
      const session = await api.createCheckoutSession(orderId)
      openRazorpayCheckout({
        session,
        user,
        onSuccess: async (payment) => {
          try {
            const paidOrder = await api.verifyPayment(payment)
            clearCart()
            navigate(`/orders/${paidOrder.id}?status=success`, {
              replace: true,
              state: { order: paidOrder },
            })
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Payment verification failed")
            setSubmitting(false)
          }
        },
        onDismiss: () => {
          setError("Payment cancelled. Your order remains pending.")
          setSubmitting(false)
        },
        onFailure: () => {
          setError("Payment failed. Your order remains pending.")
          setSubmitting(false)
        },
      })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not start checkout")
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-xl p-12 text-center shadow-subtle">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nothing to check out</h1>
        <p className="mt-2 text-slate-500">Your shopping cart is currently empty.</p>
        <Button asChild className="mt-6"><Link to="/">Browse products</Link></Button>
      </Card>
    )
  }

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900">Checkout</h1>
      <Card className="shadow-subtle border-slate-200/80 bg-white/95">
        <CardHeader><CardTitle className="text-xl">Review your order</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="divide-y divide-slate-100 border-y border-slate-100">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 text-xl font-extrabold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          {error && <p className="rounded-xl border border-red-200/90 bg-red-50/90 p-4 text-sm font-medium text-red-700">{error}</p>}
          <Button size="lg" className="w-full" disabled={submitting} onClick={() => void handlePayNow()}>
            <CreditCard className="mr-2 size-5" /> {submitting ? "Opening secure checkout..." : "Pay now"}
          </Button>
          {pendingOrderId && (
            <p className="rounded-lg bg-indigo-50/80 border border-indigo-100 p-3 text-center text-xs font-medium text-indigo-900">
              Pending order #{pendingOrderId.slice(0, 8)} was created. Retrying will use this order.
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
