#!/usr/bin/env node
// Revisa que cada carpeta de api/funciones/ tenga un funcion.yaml completo y válido.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const base = "api/funciones";
const obligatorios = ["nombre", "frase", "dueno_rol", "clase", "nivel_propuesto", "datos", "depende_de", "reutilizable", "version"];
const valores = { clase: ["negocio", "interfaz", "plataforma"], nivel_propuesto: ["N0", "N1", "N2", "N3"], reutilizable: ["no", "propuesta", "aprobada"] };
let fallas = 0;
const falla = (m) => { fallas++; console.error(`✗ ${m}`); };

const carpetas = readdirSync(base).filter((f) => statSync(path.join(base, f)).isDirectory());
for (const nombre of carpetas) {
  const archivo = path.join(base, nombre, "funcion.yaml");
  if (!existsSync(archivo)) { falla(`${nombre}: falta funcion.yaml`); continue; }
  const ficha = parse(readFileSync(archivo, "utf8")) ?? {};
  for (const k of obligatorios) if (ficha[k] === undefined || ficha[k] === null || ficha[k] === "") falla(`${archivo}: falta "${k}"`);
  for (const [k, ok] of Object.entries(valores)) if (ficha[k] !== undefined && !ok.includes(String(ficha[k]))) falla(`${archivo}: "${k}" debe ser ${ok.join(" | ")}`);
  if (ficha.nombre && ficha.nombre !== nombre) falla(`${archivo}: nombre "${ficha.nombre}" no coincide con la carpeta "${nombre}"`);
  for (const k of ["datos", "depende_de"]) if (ficha[k] !== undefined && !Array.isArray(ficha[k])) falla(`${archivo}: "${k}" debe ser una lista`);
  for (const k of ["contrato", "ejemplos"]) if (ficha[k] && !existsSync(ficha[k])) falla(`${archivo}: "${k}" apunta a ${ficha[k]}, que no existe`);
}
const registro = readFileSync(path.join(base, "index.ts"), "utf8");
for (const nombre of carpetas) if (!new RegExp(`\\b${nombre.replace(/-/g, "\\-")}\\b|["']${nombre}["']`).test(registro)) falla(`${nombre}: no está registrada en ${base}/index.ts`);
if (fallas) { console.error(`\n${fallas} problema(s) en las fichas de función`); process.exit(1); }
console.log(`Fichas de función OK (${carpetas.length})`);
