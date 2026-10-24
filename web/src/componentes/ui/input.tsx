import { cn } from "@web/lib/utils";
import type { InputHTMLAttributes } from "react";
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-9 w-full rounded-md border border-border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30", className)} {...props} />;
}
