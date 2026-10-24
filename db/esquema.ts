import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Forma del dato en la base (NOT NULL, CHECK, UNIQUE, PK). Relaciones entre tablas: en el código, ver RELACIONES.md.
// Debe coincidir con db/migraciones/*.sql (la verdad para DSQL es el SQL, no este archivo).
export const tareas = pgTable("tareas", {
  id: uuid("id").primaryKey(),
  titulo: text("titulo").notNull(),
  detalle: text("detalle").notNull().default(""),
  estado: text("estado").notNull().default("pendiente"),
  creadaPor: text("creada_por").notNull(),
  creadaEn: timestamp("creada_en", { withTimezone: true }).notNull().defaultNow(),
  actualizadaEn: timestamp("actualizada_en", { withTimezone: true }).notNull().defaultNow(),
});
