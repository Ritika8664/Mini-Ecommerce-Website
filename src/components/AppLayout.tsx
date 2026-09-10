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
    cn(
      "relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100",
      isActive && "text-slate-900 font-semibold bg-slate-100 border border-slate-200/80 shadow-2xs"
    )
  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-dashboard-grid text-slate-900 antialiased">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-background/95 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-semibold text-slate-900 hover:opacity-90 transition-opacity">
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-900 text-slate-50 shadow-xs">
              <ShoppingBag className="size-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900">Mini Commerce</span>
          </Link>
          <nav className="hidden items-center gap-1.5 md:flex">
            <NavLink to="/" end className={linkClass}>Products</NavLink>
            {user?.role === "customer" && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
            <Link
              to="/cart"
              className="relative ml-2 flex size-9 items-center justify-center rounded-md border border-slate-200 bg-background text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 hover:text-slate-900 active:scale-95"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart className="size-4" />
              {itemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-4 min-w-4 justify-center border-background bg-slate-900 px-1 text-[10px] font-bold text-slate-50 shadow-2xs">
                  {itemCount}
                </Badge>
              )}
            </Link>
            <div className="ml-2">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={() => void handleLogout()}>Sign out</Button>
              ) : (
                <Button asChild size="sm"><Link to="/login">Sign in</Link></Button>
              )}
            </div>
          </nav>
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
        {menuOpen && (
          <nav className="container flex flex-col gap-1.5 border-t border-slate-200 bg-background py-4 md:hidden" onClick={() => setMenuOpen(false)}>
            <NavLink to="/" end className={linkClass}>Products</NavLink>
            {user?.role === "customer" && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
            <NavLink to="/cart" className={linkClass}>Cart ({itemCount})</NavLink>
            <div className="pt-2">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" className="w-full justify-center" onClick={() => void handleLogout()}>Sign out</Button>
              ) : (
                <Button asChild size="sm" className="w-full justify-center"><Link to="/login">Sign in</Link></Button>
              )}
            </div>
          </nav>
        )}
      </header>
      <main className="container flex-1 py-8 md:py-10"><Outlet /></main>
      <footer className="border-t border-slate-200/80 bg-background py-6 text-center text-xs text-slate-500">
        <div className="container">
          <p>© {new Date().getFullYear()} Mini Commerce. Crafted for exceptional quality & smooth checkout.</p>
        </div>
      </footer>
      {isAuthenticated && <SupportChat />}
    </div>
  )
}

