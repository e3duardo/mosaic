import { twMerge } from "tailwind-merge"

function toClassValue(x: unknown): string {
  if (x == null || x === false) return ""
  if (typeof x === "string") return x
  if (Array.isArray(x)) return x.map(toClassValue).filter(Boolean).join(" ")
  if (typeof x === "object") {
    return Object.entries(x)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
      .join(" ")
  }
  return ""
}

export function cn(...inputs: unknown[]) {
  return twMerge(inputs.map(toClassValue).filter(Boolean).join(" "))
}
