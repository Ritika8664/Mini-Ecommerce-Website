import type { RazorpayCheckoutSession, RazorpayPaymentResult } from "@/lib/api"
import type { User } from "@/types"

interface OpenCheckoutOptions {
  session: RazorpayCheckoutSession
  user: User
  onSuccess: (payment: RazorpayPaymentResult) => Promise<void>
  onDismiss: () => void
  onFailure: () => void
}

export function openRazorpayCheckout({
  session,
  user,
  onSuccess,
  onDismiss,
  onFailure,
}: OpenCheckoutOptions) {
  if (!window.Razorpay) {
    throw new Error("Razorpay Checkout failed to load. Please refresh and try again.")
  }

  const checkout = new window.Razorpay({
    key: session.key_id,
    amount: session.amount,
    currency: session.currency,
    name: "Mini Commerce",
    description: "Order payment",
    order_id: session.razorpay_order_id,
    prefill: { name: user.name, email: user.email },
    handler: (payment) => void onSuccess(payment),
    modal: { ondismiss: onDismiss },
  })
  checkout.on("payment.failed", onFailure)
  checkout.open()
}
