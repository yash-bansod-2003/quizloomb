import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export function generateId() {
  const rawUuid = uuidv4();
  const hash = crypto.createHash("sha256").update(rawUuid).digest("base64url");
  return hash.slice(0, 32);
}
