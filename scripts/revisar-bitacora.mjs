// Chequeo de privacidad de docs/decisiones.md: sin correos, cédulas, teléfonos ni montos.
import { readFileSync } from "node:fs";
const texto = readFileSync("docs/decisiones.md", "utf8");
const patrones = [
  [/[\w.+-]+@[\w-]+\.[\w.]+/, "correo"],
  [/\b\d{1,3}(\.\d{3}){2,}\b|\b\d{7,10}\b/, "número tipo cédula/teléfono"],
  [/\$\s?\d[\d.,]{3,}|\b\d[\d.,]{3,}\s?(COP|USD|pesos)\b/i, "monto"],
];
const hallados = patrones.filter(([re]) => re.test(texto)).map(([, n]) => n);
if (hallados.length) { console.error(`✗ docs/decisiones.md parece tener datos personales o cifras: ${hallados.join(", ")}`); process.exit(1); }
console.log("bitácora sin datos personales");
