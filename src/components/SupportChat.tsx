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
        <Button className="fixed bottom-6 right-6 z-40 size-12 rounded-full p-0 bg-slate-900 text-slate-50 shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center" aria-label="Open customer support">
          <MessageCircle className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[min(600px,calc(100vh-2rem))] max-w-md flex-col overflow-hidden p-0 rounded-xl border border-slate-200 bg-background shadow-lg">
        <DialogHeader className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <DialogTitle className="flex items-center gap-2.5 text-sm font-semibold text-slate-900">
            <div className="flex size-7 items-center justify-center rounded-md bg-slate-900 text-slate-50 shadow-xs">
              <Bot className="size-3.5" />
            </div>
            Product and order support
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
          {messages.length === 0 && (
            <p className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 text-xs text-slate-600 shadow-2xs">
              Ask about available products, prices, stock, or one of your orders.
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs",
                message.role === "user"
                  ? "ml-auto rounded-tr-xs bg-slate-900 text-slate-50 font-normal"
                  : "rounded-tl-xs border border-slate-200 bg-slate-100/80 text-slate-900 font-normal",
              )}
            >
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2 text-xs font-normal text-slate-500 shadow-2xs">
              <LoaderCircle className="size-3.5 animate-spin text-slate-900" />Checking store data...
            </div>
          )}
        </div>
        <form className="flex gap-2 border-t border-slate-200 bg-background p-3.5" onSubmit={sendMessage}>
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a question..."
            maxLength={1000}
            disabled={loading}
            aria-label="Support message"
            className="rounded-md h-9 text-xs shadow-2xs"
          />
          <Button size="sm" className="shrink-0 px-3" disabled={loading || !input.trim()} aria-label="Send message">
            <Send className="size-3.5" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

