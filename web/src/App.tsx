import { useEffect, useState, type FormEvent } from "react";
import { estadosTarea, tareaNueva, type Tarea } from "@shared/esquemas/tarea";
import { api } from "./api";
import { Button } from "./componentes/ui/button";
import { Card } from "./componentes/ui/card";
import { Input } from "./componentes/ui/input";

// Pantalla de ejemplo: listar, crear, cambiar estado y borrar. Copiala para tu propia entidad.
export function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState("");
  const [error, setError] = useState("");

  const cargar = () => api.listar().then(setTareas).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, []);

  async function crear(e: FormEvent) {
    e.preventDefault();
    const r = tareaNueva.safeParse({ titulo }); // misma validación que el servidor
    if (!r.success) return setError(r.error.issues[0]?.message ?? "dato inválido");
    setError("");
    await api.crear(r.data).catch((e) => setError(e.message));
    setTitulo("");
    cargar();
  }

  return (
    <main className="mx-auto max-w-2xl p-8 space-y-6">
      <h1 className="text-2xl font-semibold">Tareas</h1>
      <Card>
        <form onSubmit={crear} className="flex gap-2">
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Nueva tarea" />
          <Button type="submit">Agregar</Button>
        </form>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </Card>
      <ul className="space-y-2">
        {tareas.map((t) => (
          <li key={t.id} className="flex items-center gap-3 rounded-md border border-border p-3">
            <span className="flex-1">{t.titulo}</span>
            <select className="rounded-md border border-border px-2 py-1 text-sm" value={t.estado}
              onChange={(e) => api.cambiar(t.id, { estado: e.target.value as Tarea["estado"] }).then(cargar)}>
              {estadosTarea.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
            </select>
            <Button variant="destructive" onClick={() => api.borrar(t.id).then(cargar)}>Borrar</Button>
          </li>
        ))}
        {tareas.length === 0 && <p className="text-sm text-muted-foreground">Todavía no hay tareas.</p>}
      </ul>
    </main>
  );
}
