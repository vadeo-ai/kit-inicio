import type { Tarea, TareaCambio, TareaNueva } from "@shared/esquemas/tarea";

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  const r = await fetch(ruta, { ...init, headers: { "content-type": "application/json", ...init?.headers } });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? `error ${r.status}`);
  return (r.status === 204 ? undefined : await r.json()) as T;
}

export const api = {
  listar: () => pedir<Tarea[]>("/api/tareas"),
  crear: (t: TareaNueva) => pedir<Tarea>("/api/tareas", { method: "POST", body: JSON.stringify(t) }),
  cambiar: (id: string, t: TareaCambio) => pedir<Tarea>(`/api/tareas/${id}`, { method: "PATCH", body: JSON.stringify(t) }),
  borrar: (id: string) => pedir<void>(`/api/tareas/${id}`, { method: "DELETE" }),
};
