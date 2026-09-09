import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.id}`} className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-md">
        <div className="aspect-square overflow-hidden bg-slate-100">
          <img src={product.image_url} alt={product.name} className="size-full object-cover transition duration-300 group-hover:scale-105" />
        </div>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold leading-tight">{product.name}</h2>
            <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="shrink-0">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
          </div>
          <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
