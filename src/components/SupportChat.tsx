import { Bot, LoaderCircle, MessageCircle, Send } from "lucide-react"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: number
  role: "user" | "assistant"
  text: string
}

export function SupportChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault()
    const message = input.trim()
    if (!message || loading) return

    const id = Date.now()
    setMessages((current) => [...current, { id, role: "user", text: message }])
    setInput("")
    setLoading(true)
    try {
      const result = await api.chat(message)
      setMessages((current) => [
        ...current,
        { id: id + 1, role: "assistant", text: result.response },
      ])
    } catch (reason) {
      setMessages((current) => [
        ...current,
        {
          id: id + 1,
          role: "assistant",
          text: reason instanceof Error ? reason.message : "Support is unavailable right now.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 z-40 size-13 rounded-full p-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:scale-105 active:scale-95 transition-all duration-200" aria-label="Open customer support">
          <MessageCircle className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[min(620px,calc(100vh-2rem))] max-w-md flex-col overflow-hidden p-0 rounded-2xl border-slate-200/80 shadow-card-hover">
        <DialogHeader className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/90 p-5">
          <DialogTitle className="flex items-center gap-2.5 text-base font-bold text-slate-900">
            <div className="flex size-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-2xs">
              <Bot className="size-4" />
            </div>
            Product and order support
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 space-y-3.5 overflow-y-auto p-5" aria-live="polite">
          {messages.length === 0 && (
            <p className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm font-medium text-slate-600 shadow-2xs">
              Ask about available products, prices, stock, or one of your orders.
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-2xs",
                message.role === "user"
                  ? "ml-auto rounded-tr-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
                  : "rounded-tl-xs border border-slate-200/70 bg-slate-100/90 text-slate-900 font-medium",
              )}
            >
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="flex w-fit items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-100/90 px-4 py-2.5 text-sm font-medium text-slate-500 shadow-2xs">
              <LoaderCircle className="size-4 animate-spin text-indigo-600" />Checking store data...
            </div>
          )}
        </div>
        <form className="flex gap-2 border-t border-slate-100 bg-white p-4" onSubmit={sendMessage}>
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a question..."
            maxLength={1000}
            disabled={loading}
            aria-label="Support message"
            className="rounded-xl shadow-2xs"
          />
          <Button className="shrink-0 rounded-xl px-4" disabled={loading || !input.trim()} aria-label="Send message">
            <Send className="size-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
