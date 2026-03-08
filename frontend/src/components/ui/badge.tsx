import * as React from "react"

import { cn } from "@/lib/utils"

const variantClasses: Record<string, string> = {
  default: "bg-slate-800 text-white [a]:hover:bg-slate-700",
  secondary: "bg-slate-100 text-slate-700 [a]:hover:bg-slate-200",
  destructive: "bg-red-50 text-red-700 [a]:hover:bg-red-100",
  outline: "border border-slate-200 bg-transparent text-slate-700 [a]:hover:bg-slate-50",
  ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
  link: "bg-transparent text-slate-800 underline-offset-4 hover:underline",
}

const baseClasses =
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all [&>svg]:pointer-events-none [&>svg]:size-3"

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: keyof typeof variantClasses }) {
  return (
    <span
      data-slot="badge"
      className={cn(baseClasses, variantClasses[variant] ?? variantClasses.default, className)}
      {...props}
    />
  )
}

export { Badge }
