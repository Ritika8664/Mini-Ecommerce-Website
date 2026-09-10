import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { QuantitySelector } from "@/components/QuantitySelector"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/contexts/CartContext"
import { api } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types"

export function ProductDetailPage() {
  const { id = "" } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let active = true
    api.getProduct(id)
      .then((data) => active && setProduct(data))
      .catch((reason: Error) => active && setError(reason.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  if (loading) return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      <Skeleton className="aspect-square rounded-3xl bg-slate-200/60" />
      <div className="space-y-6 pt-4">
        <Skeleton className="h-6 w-1/4 rounded-full" />
        <Skeleton className="h-12 w-3/4 rounded-lg" />
        <Skeleton className="h-8 w-1/3 rounded-md" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  )
  if (error || !product) return (
    <Card className="mx-auto max-w-xl p-10 text-center shadow-subtle">
      <p className="text-base font-semibold text-red-600">{error || "Product not found"}</p>
      <Button asChild variant="outline" className="mt-6"><Link to="/">Back to products</Link></Button>
    </Card>
  )

  const handleAdd = () => {
    addItem(product, quantity)
    setAdded(true)
  }

  return (
    <section className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 items-center">
      <div className="aspect-square overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-2.5 shadow-card">
        <img src={product.image_url} alt={product.name} className="size-full rounded-2xl object-cover" />
      </div>
      <div className="flex flex-col justify-center">
        <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="mb-4 w-fit px-3 py-1 text-xs">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">{product.name}</h1>
        <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">{formatCurrency(product.price)}</p>
        <p className="mt-6 text-base leading-relaxed text-slate-600">{product.description}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-subtle">
          <QuantitySelector value={quantity} max={Math.max(1, product.stock)} onChange={setQuantity} />
          <Button size="lg" disabled={product.stock === 0} onClick={handleAdd} className="flex-1 min-w-[180px]">
            <ShoppingCart className="mr-2 size-5" /> {added ? "Added to cart ✓" : "Add to cart"}
          </Button>
        </div>
      </div>
    </section>
  )
}
