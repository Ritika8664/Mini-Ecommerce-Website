import { Pencil, Plus, Trash2 } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import type { Product, ProductInput } from "@/types"

const emptyProduct: ProductInput = { name: "", description: "", price: 0, stock: 0, image_url: "", is_active: true }

interface AdminProductTableProps {
  products: Product[]
  onSave: (product: ProductInput, id?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function ProductDialog({ product, onSave }: { product?: Product; onSave: AdminProductTableProps["onSave"] }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<ProductInput>(product ? { ...product, price: Number(product.price) } : emptyProduct)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(product ? { ...product, price: Number(product.price) } : emptyProduct)
  }, [product, open])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onSave(form, product?.id)
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {product ? (
          <Button variant="outline" size="icon" className="size-8 text-slate-700" aria-label={`Edit ${product.name}`}>
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="mr-1.5 size-4" />Add product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 pt-2" onSubmit={submit}>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Name
            <Input className="mt-1.5 font-normal" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Description
            <textarea
              className="mt-1.5 flex min-h-20 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:border-slate-400 transition-colors"
              required
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Price
              <Input className="mt-1.5 font-normal" type="number" min="0" step="0.01" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.valueAsNumber })} />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
              Stock
              <Input className="mt-1.5 font-normal" type="number" min="0" required value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.valueAsNumber })} />
            </label>
          </div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Image URL
            <Input className="mt-1.5 font-normal" type="url" required value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer pt-1">
            <input type="checkbox" className="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
            Active
          </label>
          <Button className="w-full mt-2" disabled={saving}>{saving ? "Saving…" : "Save product"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AdminProductTable({ products, onSave, onDelete }: AdminProductTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Products</h2>
        <ProductDialog onSave={onSave} />
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-semibold text-slate-900">{product.name}</TableCell>
                <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                <TableCell className="font-medium">{product.stock}</TableCell>
                <TableCell><Badge variant={product.is_active ? "secondary" : "outline"}>{product.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1.5">
                    <ProductDialog product={product} onSave={onSave} />
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                      onClick={() => void onDelete(product.id)}
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No products found.</p>}
      </div>
    </div>
  )
}

