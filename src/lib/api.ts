import type { Order, OrderStatus, Product, ProductInput, User } from "@/types";

export interface RazorpayCheckoutSession {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface RazorpayPaymentResult {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new ApiError(response.status, body?.detail ?? "Request failed");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  googleLogin: (credential: string) =>
    request<{ access_token: string; token_type: "bearer"; user: User }>(
      "/auth/google",
      {
        method: "POST",
        body: JSON.stringify({ credential }),
      },
    ),
  getMe: () => request<User>("/auth/me"),
  logout: () => request<{ detail: string }>("/auth/logout", { method: "POST" }),
  chat: (message: string) =>
    request<{ response: string }>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  getProducts: () => request<Product[]>("/products"),
  getProduct: (id: string) => request<Product>(`/products/${id}`),
  createOrder: (items: { product_id: string; quantity: number }[]) =>
    request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),
  getMyOrders: () => request<Order[]>("/orders/me"),
  getOrder: (id: string) => request<Order>(`/orders/${id}`),
  createCheckoutSession: (id: string) =>
    request<RazorpayCheckoutSession>(`/orders/${id}/checkout-session`, {
      method: "POST",
    }),
  verifyPayment: (payment: RazorpayPaymentResult) =>
    request<Order>("/payments/verify", {
      method: "POST",
      body: JSON.stringify(payment),
    }),
  getAdminOrders: () => request<Order[]>("/admin/orders"),
  createProduct: (product: ProductInput) =>
    request<Product>("/admin/products", {
      method: "POST",
      body: JSON.stringify(product),
    }),
  updateProduct: (id: string, product: ProductInput) =>
    request<Product>(`/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),
  deleteProduct: (id: string) =>
    request<void>(`/admin/products/${id}`, { method: "DELETE" }),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<Order>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
