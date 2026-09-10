import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.id}`} className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4">
      <Card className="h-full overflow-hidden border border-slate-200/80 bg-white/95 shadow-subtle transition-all duration-200 group-hover:-translate-y-1.5 group-hover:border-indigo-200/90 group-hover:shadow-card-hover">
        <div className="relative aspect-square overflow-hidden bg-slate-100/80 border-b border-slate-100">
          <img src={product.image_url} alt={product.name} className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <CardContent className="flex flex-col justify-between space-y-4 p-5">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-indigo-600">{product.name}</h2>
            </div>
            <p className="text-xl font-bold tracking-tight text-slate-900">{formatCurrency(product.price)}</p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="shrink-0 text-[11px]">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
            <span className="text-xs font-semibold text-indigo-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">View details →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
