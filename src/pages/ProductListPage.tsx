import { useEffect, useState } from "react"

import { ProductCard } from "@/components/ProductCard"
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
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Shop</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">All products</h1>
      </div>
      {error && <Card className="p-6 text-center text-red-600">{error}</Card>}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-[3/4] rounded-xl" />)}
        </div>
      )}
      {!loading && !error && products.length === 0 && <Card className="p-10 text-center text-slate-500">No products are available yet.</Card>}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </section>
  )
}
