import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "nyatelie-secret-key-croche-artesanal-2026";

export function signAdminToken() {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("nyatelie_admin_session")?.value;
  if (!token) return false;
  return verifyAdminToken(token) !== null;
}
