import { Menu, ShoppingBag, ShoppingCart, X } from "lucide-react"
import { useState } from "react"
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { cn } from "@/lib/utils"
import { SupportChat } from "@/components/SupportChat"

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { itemCount } = useCart()
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn("text-sm font-medium text-slate-600 hover:text-foreground", isActive && "text-foreground")
  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50/60">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold"><ShoppingBag className="size-5" /> Mini Commerce</Link>
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/" end className={linkClass}>Products</NavLink>
            {user?.role === "customer" && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
            <Link to="/cart" className="relative" aria-label={`Cart with ${itemCount} items`}>
              <ShoppingCart className="size-5" />
              {itemCount > 0 && <Badge className="absolute -right-3 -top-3 h-5 min-w-5 justify-center px-1">{itemCount}</Badge>}
            </Link>
            {isAuthenticated ? <Button variant="outline" size="sm" onClick={() => void handleLogout()}>Sign out</Button> : <Button asChild size="sm"><Link to="/login">Sign in</Link></Button>}
          </nav>
          <Button variant="outline" className="size-10 px-0 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
        {menuOpen && (
          <nav className="container flex flex-col gap-4 border-t py-4 md:hidden" onClick={() => setMenuOpen(false)}>
            <NavLink to="/" end className={linkClass}>Products</NavLink>
            {user?.role === "customer" && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
            <NavLink to="/cart" className={linkClass}>Cart ({itemCount})</NavLink>
            {isAuthenticated ? <Button variant="outline" size="sm" onClick={() => void handleLogout()}>Sign out</Button> : <Button asChild size="sm"><Link to="/login">Sign in</Link></Button>}
          </nav>
        )}
      </header>
      <main className="container py-8 md:py-12"><Outlet /></main>
      {isAuthenticated && <SupportChat />}
    </div>
  )
}
