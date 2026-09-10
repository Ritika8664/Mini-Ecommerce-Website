import { useEffect, useState } from "react"

import { AdminOrderTable } from "@/components/AdminOrderTable"
import { AdminProductTable } from "@/components/AdminProductTable"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/api"
import type { Order, OrderStatus, Product, ProductInput } from "@/types"

type Tab = "products" | "orders"

export function AdminPage() {
  const [tab, setTab] = useState<Tab>("products")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    Promise.all([api.getProducts(), api.getAdminOrders()])
      .then(([nextProducts, nextOrders]) => {
        if (active) { setProducts(nextProducts); setOrders(nextOrders) }
      })
      .catch((reason: Error) => active && setError(reason.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const saveProduct = async (input: ProductInput, id?: string) => {
    setError("")
    try {
      const saved = id ? await api.updateProduct(id, input) : await api.createProduct(input)
      setProducts((current) => id ? current.map((product) => product.id === id ? saved : product) : [...current, saved])
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save product")
      throw reason
    }
  }

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return
    setError("")
    try {
      await api.deleteProduct(id)
      setProducts((current) => current.filter((product) => product.id !== id))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete product")
    }
  }

  const updateStatus = async (id: string, status: OrderStatus) => {
    setError("")
    try {
      const updated = await api.updateOrderStatus(id, status)
      setOrders((current) => current.map((order) => order.id === id ? updated : order))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update order")
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Admin dashboard</h1>
      <div className="flex w-fit gap-1.5 rounded-xl border border-slate-200/80 bg-white/90 p-1.5 shadow-2xs">
        <Button variant={tab === "products" ? "default" : "outline"} size="sm" className="rounded-lg px-4 font-semibold" onClick={() => setTab("products")}>Products</Button>
        <Button variant={tab === "orders" ? "default" : "outline"} size="sm" className="rounded-lg px-4 font-semibold" onClick={() => setTab("orders")}>Orders</Button>
      </div>
      {error && <Card className="border-rose-200/90 bg-rose-50/90 p-4 text-sm font-medium text-rose-700 shadow-2xs">{error}</Card>}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 rounded-xl bg-slate-200/60" />
          <Skeleton className="h-64 rounded-2xl bg-slate-200/60" />
        </div>
      ) : tab === "products" ? (
        <AdminProductTable products={products} onSave={saveProduct} onDelete={deleteProduct} />
      ) : (
        <AdminOrderTable orders={orders} onStatusChange={updateStatus} />
      )}
    </section>
  )
}
