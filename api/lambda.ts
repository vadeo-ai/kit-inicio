import { handle } from "hono/aws-lambda";
import { app } from "./app.ts";

// Todas las funciones en una sola Lambda (útil para probar). El build arma además una Lambda por función.
export const handler = handle(app);
