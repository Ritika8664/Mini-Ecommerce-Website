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
      "relative px-3.5 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/50",
      isActive && "text-indigo-950 font-semibold bg-indigo-50/90 shadow-2xs border border-indigo-100/60"
    )
  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col bg-ambient-grid text-slate-900">
      <header className="sticky top-0 z-40 glass-header shadow-2xs">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 hover:opacity-90 transition-opacity">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-sm shadow-indigo-500/20">
              <ShoppingBag className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">Mini Commerce</span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" end className={linkClass}>Products</NavLink>
            {user?.role === "customer" && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
            <Link
              to="/cart"
              className="relative ml-2 flex size-10 items-center justify-center rounded-lg border border-slate-200/70 bg-white/80 text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-100/80 hover:text-slate-900 active:scale-95"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart className="size-4" />
              {itemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 min-w-5 justify-center border-white/80 bg-gradient-to-r from-indigo-600 to-purple-600 px-1 text-[11px] font-bold text-white shadow-sm">
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
          <Button variant="outline" className="size-10 rounded-lg px-0 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
        {menuOpen && (
          <nav className="container flex flex-col gap-2 border-t border-slate-200/60 bg-white/95 py-4 backdrop-blur-md md:hidden" onClick={() => setMenuOpen(false)}>
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
      <main className="container flex-1 py-8 md:py-12"><Outlet /></main>
      <footer className="border-t border-slate-200/60 bg-white/60 py-6 text-center text-xs text-slate-500 backdrop-blur-xs">
        <div className="container">
          <p>© {new Date().getFullYear()} Mini Commerce. Crafted for exceptional quality & smooth checkout.</p>
        </div>
      </footer>
      {isAuthenticated && <SupportChat />}
    </div>
  )
}
