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
        {product ? <Button variant="outline" className="size-9 rounded-lg px-0" aria-label={`Edit ${product.name}`}><Pencil className="size-4" /></Button> : <Button><Plus className="mr-2 size-4" />Add product</Button>}
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-6">
        <DialogHeader><DialogTitle className="text-xl font-extrabold text-slate-900">{product ? "Edit product" : "Add product"}</DialogTitle></DialogHeader>
        <form className="space-y-4 pt-2" onSubmit={submit}>
          <label className="block text-sm font-semibold text-slate-700">Name<Input className="mt-1" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
          <label className="block text-sm font-semibold text-slate-700">Description<textarea className="mt-1 min-h-24 w-full rounded-lg border border-slate-200/90 bg-white/90 p-3 text-sm text-slate-900 outline-none shadow-2xs placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/25 transition-all duration-150" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-semibold text-slate-700">Price<Input className="mt-1" type="number" min="0" step="0.01" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.valueAsNumber })} /></label>
            <label className="block text-sm font-semibold text-slate-700">Stock<Input className="mt-1" type="number" min="0" required value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.valueAsNumber })} /></label>
          </div>
          <label className="block text-sm font-semibold text-slate-700">Image URL<Input className="mt-1" type="url" required value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} /></label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />Active</label>
          <Button className="w-full mt-2" disabled={saving}>{saving ? "Saving…" : "Save product"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AdminProductTable({ products, onSave, onDelete }: AdminProductTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-900">Products</h2><ProductDialog onSave={onSave} /></div>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-subtle">
        <Table>
          <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-semibold text-slate-900">{product.name}</TableCell>
                <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                <TableCell className="font-medium">{product.stock}</TableCell>
                <TableCell><Badge variant={product.is_active ? "secondary" : "outline"}>{product.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <ProductDialog product={product} onSave={onSave} />
                    <Button variant="outline" className="size-9 rounded-lg border-slate-200/80 px-0 text-rose-600 shadow-2xs hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" onClick={() => void onDelete(product.id)} aria-label={`Delete ${product.name}`}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {products.length === 0 && <p className="p-10 text-center text-sm font-medium text-slate-500">No products found.</p>}
      </div>
    </div>
  )
}
