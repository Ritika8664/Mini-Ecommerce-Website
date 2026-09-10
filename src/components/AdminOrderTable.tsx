import { OrderStatusBadge } from "@/components/OrderStatusBadge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Order, OrderStatus } from "@/types"

const statuses: OrderStatus[] = ["pending", "paid", "failed", "cancelled"]

export function AdminOrderTable({ orders, onStatusChange }: { orders: Order[]; onStatusChange: (id: string, status: OrderStatus) => Promise<void> }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">Orders</h2>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-36">Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-semibold text-slate-900">#{order.id.slice(0, 8)}</TableCell>
                <TableCell className="font-medium text-slate-500">{formatDate(order.created_at)}</TableCell>
                <TableCell className="font-medium text-slate-500">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                <TableCell className="font-bold text-slate-900">{formatCurrency(order.total_amount)}</TableCell>
                <TableCell><OrderStatusBadge status={order.status} /></TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(value) => void onStatusChange(order.id, value as OrderStatus)}>
                    <SelectTrigger className="h-8 text-xs rounded-md shadow-2xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-md">
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <span className="capitalize font-medium text-xs">{status}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No orders found.</p>}
      </div>
    </div>
  )
}

