import { Navigate, Route, Routes } from "react-router-dom"

import { AppLayout } from "@/components/AppLayout"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AdminPage } from "@/pages/AdminPage"
import { CartPage } from "@/pages/CartPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { OrderDetailPage } from "@/pages/OrderDetailPage"
import { OrdersPage } from "@/pages/OrdersPage"
import { LoginPage } from "@/pages/LoginPage"
import { ProductDetailPage } from "@/pages/ProductDetailPage"
import { ProductListPage } from "@/pages/ProductListPage"

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route element={<ProtectedRoute role="customer" />}>
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>
        <Route element={<ProtectedRoute role="admin" />}><Route path="admin" element={<AdminPage />} /></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
