import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.id}`} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
      <Card className="h-full overflow-hidden border border-slate-200 bg-card shadow-xs transition-all duration-200 group-hover:-translate-y-1 group-hover:border-slate-300 group-hover:shadow-md">
        <div className="relative aspect-square overflow-hidden bg-slate-100/80 border-b border-slate-100">
          <img src={product.image_url} alt={product.name} className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
        </div>
        <CardContent className="flex flex-col justify-between space-y-4 p-5">
          <div className="space-y-1.5">
            <h2 className="font-semibold text-base leading-snug text-slate-900 transition-colors duration-200 group-hover:text-slate-900">{product.name}</h2>
            <p className="text-lg font-bold tracking-tight text-slate-900">{formatCurrency(product.price)}</p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="shrink-0 text-[11px]">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
            <span className="text-xs font-medium text-slate-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:text-slate-900">View details →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

