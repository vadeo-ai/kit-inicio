// Componente estilo shadcn/ui. Para agregar más: `npx shadcn@latest add <componente>` o copiar de ui.shadcn.com.
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@web/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const variantes = cva("inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 disabled:opacity-50 transition-colors", {
  variants: { variant: {
    default: "bg-primary text-primary-foreground hover:opacity-90",
    outline: "border border-border hover:bg-muted",
    destructive: "text-destructive hover:bg-muted",
  } },
  defaultVariants: { variant: "default" },
});

export function Button({ className, variant, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof variantes>) {
  return <button className={cn(variantes({ variant }), className)} {...props} />;
}
