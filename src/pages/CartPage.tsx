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
      <Card className="mx-auto max-w-xl p-10 text-center">
        <ShoppingCart className="mx-auto size-10 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Add something from the product catalog to get started.</p>
        <Button asChild className="mt-6"><Link to="/">Browse products</Link></Button>
      </Card>
    )
  }

  return (
    <section>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Shopping cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <Card className="px-6">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onQuantityChange={(quantity) => setQuantity(item.productId, quantity)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </Card>
        <Card className="h-fit">
          <CardHeader><CardTitle>Order summary</CardTitle></CardHeader>
          <CardContent>
            <div className="flex justify-between border-b pb-4 text-slate-600"><span>Items</span><span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span></div>
            <div className="flex justify-between py-5 text-lg font-bold"><span>Total</span><span>{formatCurrency(total)}</span></div>
            <Button asChild size="lg" className="w-full"><Link to="/checkout">Checkout <ArrowRight className="ml-2 size-4" /></Link></Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
