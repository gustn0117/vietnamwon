import "server-only";

const url = process.env.SUPABASE_URL ?? "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const schema = process.env.SUPABASE_SCHEMA ?? "vietnamwon";
const bucket = process.env.SUPABASE_BUCKET ?? "vietnamwon";

function headers(write = false) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...(write ? { "Content-Profile": schema } : { "Accept-Profile": schema }),
  };
}

export async function rest(path: string, init?: RequestInit & { write?: boolean }) {
  const { write, ...options } = init ?? {};
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: { ...headers(write), ...(options.headers ?? {}) },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return response;
}

export async function uploadImage(file: File) {
  const extension = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${name}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: new Uint8Array(await file.arrayBuffer()),
  });
  if (!response.ok) throw new Error(`업로드 실패: ${await response.text()}`);
  return `${url}/storage/v1/object/public/${bucket}/${name}`;
}
