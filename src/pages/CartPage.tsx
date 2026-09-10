import { ArrowRight, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"

import { CartItemRow } from "@/components/CartItemRow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"
import { formatCurrency } from "@/lib/utils"

export function CartPage() {
  const { items, total, setQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-xl p-12 text-center shadow-subtle">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/80">
          <ShoppingCart className="size-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Add something from the product catalog to get started.</p>
        <Button asChild className="mt-6"><Link to="/">Browse products</Link></Button>
      </Card>
    )
  }

  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Shopping cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <Card className="px-6 shadow-subtle divide-y border-slate-200/80">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onQuantityChange={(quantity) => setQuantity(item.productId, quantity)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </Card>
        <Card className="h-fit shadow-subtle border-slate-200/80 bg-white/95">
          <CardHeader><CardTitle className="text-xl">Order summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-4 text-sm font-medium text-slate-600">
              <span>Items</span>
              <span className="font-semibold text-slate-900">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between py-2 text-xl font-extrabold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <Button asChild size="lg" className="w-full">
              <Link to="/checkout">Checkout <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
