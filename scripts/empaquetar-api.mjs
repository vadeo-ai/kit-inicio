// Empaqueta la API para Lambda (Node 22, ESM). La infra la pone la tubería de Vadeo; esto solo arma dist/api.
//   dist/api/index.mjs              todas las funciones juntas (para probar)
//   dist/api/<funcion>/index.mjs    una Lambda por función de api/funciones/<funcion>/ (+ su funcion.yaml)
import { build } from "esbuild";
import { copyFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const comun = {
  bundle: true, platform: "node", target: "node22", format: "esm", minify: true, sourcemap: true,
  external: ["@electric-sql/pglite", "drizzle-orm/pglite"], // PGlite no va a la nube
  banner: { js: "import{createRequire}from'module';const require=createRequire(import.meta.url);" },
};
await build({ ...comun, entryPoints: ["api/lambda.ts"], outfile: "dist/api/index.mjs" });

const base = "api/funciones";
const funciones = readdirSync(base).filter((f) => statSync(path.join(base, f)).isDirectory());
for (const f of funciones) {
  const exportado = `rutas${f.split("-").map((p) => p[0].toUpperCase() + p.slice(1)).join("")}`;
  await build({ ...comun, outfile: `dist/api/${f}/index.mjs`, stdin: { resolveDir: process.cwd(), sourcefile: `lambda-${f}.ts`, loader: "ts",
    contents: `import { handle } from "hono/aws-lambda";\nimport { crearApp } from "./api/app.ts";\nimport { ${exportado} } from "./${base}/${f}/rutas.ts";\nexport const handler = handle(crearApp({ "${f}": ${exportado} }));\n` } });
  copyFileSync(path.join(base, f, "funcion.yaml"), `dist/api/${f}/funcion.yaml`);
}
console.log(`dist/api listo: 1 Lambda conjunta + ${funciones.length} por función (${funciones.join(", ")})`);
