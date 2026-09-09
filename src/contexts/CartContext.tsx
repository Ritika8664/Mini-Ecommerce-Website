import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import type { CartItem, Product } from "@/types"

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  total: number
  addItem: (product: Product, quantity: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") ?? "[]") as CartItem[]
    } catch {
      return []
    }
  })

  useEffect(() => localStorage.setItem("cart", JSON.stringify(items)), [items])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
      addItem: (product, quantity) => {
        if (product.stock <= 0) return
        setItems((current) => {
          const existing = current.find((item) => item.productId === product.id)
          if (!existing) {
            return [
              ...current,
              {
                productId: product.id,
                name: product.name,
                price: Number(product.price),
                quantity: Math.min(Math.max(1, quantity), product.stock),
                stock: product.stock,
              },
            ]
          }
          return current.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock), stock: product.stock }
              : item,
          )
        })
      },
      setQuantity: (productId, quantity) =>
        setItems((current) =>
          current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
              : item,
          ),
        ),
      removeItem: (productId) => setItems((current) => current.filter((item) => item.productId !== productId)),
      clearCart: () => setItems([]),
    }),
    [items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
