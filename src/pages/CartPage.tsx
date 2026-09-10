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
      <Card className="mx-auto max-w-md p-10 text-center shadow-xs">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-slate-100 text-slate-900 border border-slate-200">
          <ShoppingCart className="size-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Your cart is empty</h1>
        <p className="mt-1 text-xs text-slate-500">Add something from the product catalog to get started.</p>
        <Button asChild size="sm" className="mt-5"><Link to="/">Browse products</Link></Button>
      </Card>
    )
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Shopping cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <Card className="px-6 shadow-xs divide-y border-slate-200">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onQuantityChange={(quantity) => setQuantity(item.productId, quantity)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </Card>
        <Card className="h-fit shadow-xs border-slate-200 bg-card">
          <CardHeader><CardTitle className="text-lg font-semibold">Order summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-3 text-sm text-slate-600">
              <span>Items</span>
              <span className="font-semibold text-slate-900">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between py-1 text-lg font-bold text-slate-900">
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

