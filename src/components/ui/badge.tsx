import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", {
  variants: {
    variant: {
      default: "border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xs",
      secondary: "border border-indigo-100/90 bg-indigo-50/90 text-indigo-900 font-semibold",
      outline: "border-slate-200/90 bg-white/80 text-slate-700 font-medium",
      destructive: "border border-rose-200/90 bg-rose-50 text-rose-700 font-semibold",
    },
  },
  defaultVariants: { variant: "default" },
})

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
