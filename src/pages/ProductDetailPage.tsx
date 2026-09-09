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

  if (loading) return <div className="grid gap-8 md:grid-cols-2"><Skeleton className="aspect-square" /><div className="space-y-4"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-28" /></div></div>
  if (error || !product) return <Card className="p-8 text-center"><p className="text-red-600">{error || "Product not found"}</p><Button asChild variant="outline" className="mt-4"><Link to="/">Back to products</Link></Button></Card>

  const handleAdd = () => {
    addItem(product, quantity)
    setAdded(true)
  }

  return (
    <section className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
        <img src={product.image_url} alt={product.name} className="size-full object-cover" />
      </div>
      <div className="flex flex-col justify-center">
        <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="mb-4 w-fit">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{product.name}</h1>
        <p className="mt-4 text-2xl font-bold">{formatCurrency(product.price)}</p>
        <p className="mt-6 leading-7 text-slate-600">{product.description}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <QuantitySelector value={quantity} max={Math.max(1, product.stock)} onChange={setQuantity} />
          <Button size="lg" disabled={product.stock === 0} onClick={handleAdd}>
            <ShoppingCart className="mr-2 size-4" /> {added ? "Added to cart" : "Add to cart"}
          </Button>
        </div>
      </div>
    </section>
  )
}
