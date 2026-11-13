import {
  randomBytes,
  createHash,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";
export const DEMO = process.env.DEMO_MODE === "true";
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, hash: string) {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return false;
  const expected = Buffer.from(key, "hex");
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}
const digest = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export async function getUser() {
  const token = (await cookies()).get("sunka_session")?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { id: digest(token) },
    include: { user: { include: { company: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  const { id, email, name, role, company } = session.user;
  return { id, email, name, role, company };
}
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 8);
  await db.session.create({
    data: { id: digest(token), userId, expiresAt: expires },
  });
  (await cookies()).set("sunka_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    expires,
  });
}
export async function logout() {
  const jar = await cookies();
  const token = jar.get("sunka_session")?.value;
  if (token) await db.session.deleteMany({ where: { id: digest(token) } });
  jar.delete("sunka_session");
}
