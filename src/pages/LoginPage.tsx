import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { LogIn, ShoppingBag } from "lucide-react"
import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, login, user } = useAuth()
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const clientConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

  if (!isLoading && isAuthenticated) {
    const fallback = user?.role === "admin" ? "/admin" : "/"
    return <Navigate to={(location.state as { from?: string } | null)?.from ?? fallback} replace />
  }

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError("Google did not return an ID token.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const profile = await login(response.credential)
      const destination = (location.state as { from?: string } | null)?.from
        ?? (profile.role === "admin" ? "/admin" : "/")
      navigate(destination, { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sign-in failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="flex min-h-[65vh] items-center justify-center py-6">
      <Card className="w-full max-w-md shadow-card border-slate-200/80 bg-white/95 p-2 sm:p-4">
        <CardHeader className="items-center text-center pb-4">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
            <ShoppingBag className="size-7" />
          </div>
          <CardTitle className="text-2xl font-extrabold text-slate-900">Sign in to Mini Commerce</CardTitle>
          <p className="mt-1 text-sm text-slate-500">Use your Google account to view orders and check out.</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 pt-2">
          {clientConfigured ? (
            <div className={submitting ? "pointer-events-none opacity-60" : ""}>
              <GoogleLogin onSuccess={(response) => void handleSuccess(response)} onError={() => setError("Google sign-in was cancelled or failed.")} />
            </div>
          ) : (
            <p className="rounded-xl border border-amber-200/80 bg-amber-50/90 p-4 text-center text-sm font-medium text-amber-800">
              Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.
            </p>
          )}
          {submitting && <p className="flex items-center gap-2 text-sm font-medium text-slate-500"><LogIn className="size-4 animate-pulse" />Signing you in…</p>}
          {error && <p className="w-full rounded-xl border border-rose-200/90 bg-rose-50/90 p-4 text-center text-sm font-medium text-rose-700">{error}</p>}
        </CardContent>
      </Card>
    </section>
  )
}
