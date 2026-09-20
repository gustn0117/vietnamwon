import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "vw_admin";
const MAX_AGE = 60 * 60 * 12;

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
}

function sign(expiry: number) {
  return createHmac("sha256", secret()).update(String(expiry)).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  return expected.length > 0 && safeEqual(input, expected);
}

export async function startSession() {
  const expiry = Date.now() + MAX_AGE * 1000;
  const store = await cookies();
  store.set(COOKIE, `${expiry}.${sign(expiry)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isSignedIn() {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expiry, signature] = value.split(".");
  if (!expiry || !signature) return false;
  if (Number(expiry) < Date.now()) return false;
  return safeEqual(signature, sign(Number(expiry)));
}

export async function requireSession() {
  if (!(await isSignedIn())) throw new Error("로그인이 필요합니다.");
}
