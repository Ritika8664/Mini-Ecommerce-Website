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
      <div className="mb-10 space-y-2">
        <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50/90 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-700 shadow-2xs">
          Explore Collection
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
          Featured Products
        </h1>
        <p className="max-w-2xl text-base text-slate-600">
          Discover our curated collection of high-quality goods designed for everyday style and reliability.
        </p>
      </div>
      {error && <Card className="border-red-200/80 bg-red-50/80 p-6 text-center text-red-700 shadow-subtle">{error}</Card>}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-[3/4] rounded-2xl bg-slate-200/60" />)}
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <Card className="p-12 text-center text-slate-500 shadow-subtle">
          <p className="text-base font-medium">No products are available yet.</p>
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
