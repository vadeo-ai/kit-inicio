#!/usr/bin/env node
// Lint básico: rechaza SQL que Aurora DSQL no acepta y lo que las reglas de Vadeo no permiten. Revisa db/migraciones/*.sql y SQL crudo en .ts.
// Si algo de esto es imprescindible, no lo saltes: anotalo en NOTAS-VADEO.md y lo resuelve Tecnología.
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const reglas = [
  [/\bREFERENCES\b|\bFOREIGN\s+KEY\b/i, "sin FOREIGN KEY, por regla de Vadeo (forma en la base, relaciones en el código): validá la relación en el código y anotala en RELACIONES.md"],
  [/\b(BIG|SMALL)?SERIAL\b|\bGENERATED\s+\w+\s+AS\s+IDENTITY\b|\bnextval\s*\(|\bCREATE\s+SEQUENCE\b/i, "sin SERIAL/IDENTITY/secuencias: usá uuid generado en la app"],
  [/\bCREATE\s+(OR\s+REPLACE\s+)?TRIGGER\b/i, "sin triggers"],
  [/\bJSONB?\b(?!\s*\()/i, "sin columnas json/jsonb, por regla de Vadeo (portabilidad): guardá el JSON en text"],
  [/\bCREATE\s+EXTENSION\b/i, "sin extensiones (pgvector, postgis…)"],
  [/\bCREATE\s+(UNIQUE\s+)?INDEX\b(?!\s+ASYNC)/i, "los índices van con CREATE INDEX ASYNC"],
  [/\b(TEMP|TEMPORARY)\s+TABLE\b/i, "sin tablas temporales"],
  [/\bMATERIALIZED\s+VIEW\b/i, "sin vistas materializadas"],
  [/\b(LISTEN|NOTIFY)\b\s+\w/i, "sin LISTEN/NOTIFY"],
  [/\bTRUNCATE\b/i, "sin TRUNCATE: borrá por lotes (máx. 3.000 filas por transacción)"],
];
const ddl = /\b(CREATE|ALTER|DROP)\s+(TABLE|INDEX|VIEW)\b/i, dml = /\b(INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM)\b/i;

const archivos = [];
const recorrer = (d) => { for (const f of readdirSync(d)) {
  const p = path.join(d, f);
  if (["node_modules", "dist", ".datos", ".git"].includes(f)) continue;
  if (statSync(p).isDirectory()) recorrer(p); else if (/\.(sql|ts)$/.test(f) && !p.includes("lint-sql")) archivos.push(p);
} };
["db", "api", "scripts"].forEach((d) => { try { recorrer(d); } catch {} });

let fallas = 0;
for (const a of archivos) {
  const texto = readFileSync(a, "utf8");
  // En .ts solo miramos texto dentro de sql`…` y sql.raw("…").
  const trozos = a.endsWith(".sql") ? texto.split(/^--- siguiente\s*$/m) : [...texto.matchAll(/sql(?:\.raw\()?\s*[`"']([^`"']*)[`"']/g)].map((m) => m[1]);
  for (const t of trozos) {
    const sinComentarios = t.replace(/--.*$/gm, "");
    for (const [re, msg] of reglas) if (re.test(sinComentarios)) { fallas++; console.error(`✗ ${a}: ${msg}\n    ${sinComentarios.match(re)[0]}`); }
    if (a.endsWith(".sql") && ddl.test(sinComentarios) && dml.test(sinComentarios)) { fallas++; console.error(`✗ ${a}: DDL y datos en el mismo bloque; separalos con "--- siguiente"`); }
    if (a.endsWith(".sql") && (sinComentarios.match(ddl) && sinComentarios.split(";").filter((s) => ddl.test(s)).length > 1)) { fallas++; console.error(`✗ ${a}: una sola sentencia DDL por bloque ("--- siguiente")`); }
  }
}
if (fallas) { console.error(`\n${fallas} problema(s): SQL no compatible con DSQL o con las reglas de Vadeo`); process.exit(1); }
console.log(`SQL compatible con DSQL (${archivos.length} archivos revisados)`);
