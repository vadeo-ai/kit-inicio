import { validator } from "hono/validator";
import type { ZodType } from "zod";

// Valida con un esquema Zod de shared/ y responde 400 con los errores en lenguaje simple.
export const validar = <T extends ZodType>(donde: "json" | "query" | "param", esquema: T) =>
  validator(donde, (valor, c) => {
    const r = esquema.safeParse(valor);
    if (!r.success) return c.json({ error: "datos inválidos", campos: r.error.issues.map((i) => ({ campo: i.path.join("."), mensaje: i.message })) }, 400);
    return r.data as T["_output"];
  });
