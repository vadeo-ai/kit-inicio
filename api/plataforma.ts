import type { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

// Piezas que pone la plantilla. No las reescribas: en Vadeo se cambian por las reales (Cognito /
// identidad central, Secrets Manager) sin tocar tu código.
export type Usuario = { id: string; nombre: string; roles: string[] };

export const autenticacion = (): MiddlewareHandler<{ Variables: { usuario: Usuario } }> => async (c, next) => {
  if (process.env.VADEO_AUTH === "real") {
    // HUECO: el adaptador real lo instala la tubería de Vadeo (JWT de la identidad central). Sin él, nadie entra.
    throw new HTTPException(501, { message: "auth real no instalada todavía" });
  }
  // Login simulado (local y prueba): el usuario sale del encabezado x-usuario-demo o es "demo".
  const id = c.req.header("x-usuario-demo") ?? "demo";
  c.set("usuario", { id, nombre: id, roles: ["editor"] });
  await next();
};

export const auth = (c: Context) => c.get("usuario") as Usuario;

export function secreto(nombre: string): string {
  // Local: variable de entorno (archivo .env que NUNCA se sube). En Vadeo: Secrets Manager.
  const v = process.env[nombre];
  if (!v) throw new Error(`falta el secreto ${nombre}`);
  return v;
}

export const log = (nivel: "info" | "error", msg: string, datos: Record<string, unknown> = {}) =>
  console[nivel === "error" ? "error" : "log"](JSON.stringify({ nivel, msg, ...datos, t: new Date().toISOString() }));
