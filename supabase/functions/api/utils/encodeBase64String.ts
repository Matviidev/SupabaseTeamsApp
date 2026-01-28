import { encodeBase64 } from "@std/encoding/base64";

export function encodeBase64String(input: string): string {
  return encodeBase64(new TextEncoder().encode(input));
}
