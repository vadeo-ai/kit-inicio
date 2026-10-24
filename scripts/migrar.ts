import { obtenerDb } from "../db/cliente.ts";
import { migrar } from "../db/migrar.ts";
await migrar(await obtenerDb());
process.exit(0);
