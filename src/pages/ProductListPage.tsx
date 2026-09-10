import { useEffect, useState } from "react"

import { ProductCard } from "@/components/ProductCard"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import type { Product } from "@/types"

export function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    api.getProducts()
      .then((data) => active && setProducts(data))
      .catch((reason: Error) => active && setError(reason.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <Badge variant="outline" className="mb-1 text-[11px] font-medium tracking-wide uppercase">
          Explore Collection
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Featured Products
        </h1>
        <p className="max-w-2xl text-sm text-slate-500">
          Discover our curated collection of high-quality goods designed for everyday style and reliability.
        </p>
      </div>
      {error && <Card className="border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700 shadow-2xs">{error}</Card>}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-[3/4] rounded-xl bg-slate-200/80" />)}
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <Card className="p-12 text-center text-slate-500 shadow-2xs">
          <p className="text-sm font-medium">No products are available yet.</p>
        </Card>
      )}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  )
}

