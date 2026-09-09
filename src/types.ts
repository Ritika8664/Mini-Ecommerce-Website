export type UserRole = "customer" | "admin"
export type OrderStatus = "pending" | "paid" | "failed" | "cancelled"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string
  is_active: boolean
  created_at: string
}

export interface ProductInput {
  name: string
  description: string
  price: number
  stock: number
  image_url: string
  is_active: boolean
}

export interface OrderItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total_amount: number
  payment_reference_id: string | null
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  stock: number
}
