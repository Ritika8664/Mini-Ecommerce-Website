import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg hover:shadow-indigo-500/30",
        secondary:
          "bg-indigo-50/90 text-indigo-900 border border-indigo-100 hover:bg-indigo-100/90 hover:border-indigo-200 shadow-xs",
        outline:
          "border border-slate-200/90 bg-white/90 text-slate-700 shadow-2xs hover:bg-slate-100/80 hover:border-slate-300 hover:text-slate-900",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-7 text-base font-semibold",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

// Shadcn components export their variants for composition in other UI components.
// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
