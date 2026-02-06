import { app } from "./app.ts";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

Deno.serve(app.fetch);
