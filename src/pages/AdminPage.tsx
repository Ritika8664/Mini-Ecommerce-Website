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
    <section>
      <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
      <div className="my-8 flex w-fit gap-2 rounded-lg border bg-background p-1">
        <Button variant={tab === "products" ? "default" : "outline"} onClick={() => setTab("products")}>Products</Button>
        <Button variant={tab === "orders" ? "default" : "outline"} onClick={() => setTab("orders")}>Orders</Button>
      </div>
      {error && <Card className="mb-5 p-4 text-sm text-red-600">{error}</Card>}
      {loading ? <div className="space-y-3"><Skeleton className="h-12" /><Skeleton className="h-64" /></div> : tab === "products" ? (
        <AdminProductTable products={products} onSave={saveProduct} onDelete={deleteProduct} />
      ) : (
        <AdminOrderTable orders={orders} onStatusChange={updateStatus} />
      )}
    </section>
  )
}
