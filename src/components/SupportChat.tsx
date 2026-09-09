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
        <Button className="fixed bottom-5 right-5 z-40 size-12 rounded-full p-0 shadow-lg" aria-label="Open customer support">
          <MessageCircle className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[min(620px,calc(100vh-2rem))] max-w-md flex-col p-0">
        <DialogHeader className="border-b p-5">
          <DialogTitle className="flex items-center gap-2"><Bot className="size-5" />Product and order support</DialogTitle>
        </DialogHeader>
        <div className="flex-1 space-y-3 overflow-y-auto p-5" aria-live="polite">
          {messages.length === 0 && (
            <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
              Ask about available products, prices, stock, or one of your orders.
            </p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-xl px-4 py-2 text-sm leading-6",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-slate-100 text-foreground",
              )}
            >
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="flex w-fit items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
              <LoaderCircle className="size-4 animate-spin" />Checking store data...
            </div>
          )}
        </div>
        <form className="flex gap-2 border-t p-4" onSubmit={sendMessage}>
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a question..."
            maxLength={1000}
            disabled={loading}
            aria-label="Support message"
          />
          <Button className="shrink-0 px-3" disabled={loading || !input.trim()} aria-label="Send message">
            <Send className="size-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
