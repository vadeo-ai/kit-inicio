import { z } from "zod";

// Contrato único de "tarea": lo usan la pantalla (formulario) y la API (validación en servidor).
export const estadosTarea = ["pendiente", "en_curso", "hecha"] as const;

export const tareaNueva = z.object({
  titulo: z.string().trim().min(1, "Escribe un título").max(200),
  detalle: z.string().max(2000).default(""),
  estado: z.enum(estadosTarea).default("pendiente"),
});
export const tareaCambio = tareaNueva.partial();

export const tarea = tareaNueva.extend({
  id: z.uuid(),
  creadaPor: z.string(),
  creadaEn: z.string(),
  actualizadaEn: z.string(),
});

export type TareaNueva = z.input<typeof tareaNueva>;
export type TareaCambio = z.infer<typeof tareaCambio>;
export type Tarea = z.infer<typeof tarea>;
