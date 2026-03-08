import * as React from "react"

import { cn } from "@/lib/utils"

const variantClasses: Record<string, string> = {
  default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
  destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 [a]:hover:bg-destructive/20",
  outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
  ghost: "hover:bg-muted hover:text-muted-foreground",
  link: "text-primary underline-offset-4 hover:underline",
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
