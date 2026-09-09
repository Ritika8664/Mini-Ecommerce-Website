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
    <section className="flex min-h-[65vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-3 rounded-full bg-secondary p-3"><ShoppingBag className="size-6" /></div>
          <CardTitle className="text-2xl">Sign in to Mini Commerce</CardTitle>
          <p className="text-sm text-slate-500">Use your Google account to view orders and check out.</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {clientConfigured ? (
            <div className={submitting ? "pointer-events-none opacity-60" : ""}>
              <GoogleLogin onSuccess={(response) => void handleSuccess(response)} onError={() => setError("Google sign-in was cancelled or failed.")} />
            </div>
          ) : (
            <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.</p>
          )}
          {submitting && <p className="flex items-center gap-2 text-sm text-slate-500"><LogIn className="size-4" />Signing you in…</p>}
          {error && <p className="w-full rounded-md bg-red-50 p-3 text-center text-sm text-red-700">{error}</p>}
        </CardContent>
      </Card>
    </section>
  )
}
