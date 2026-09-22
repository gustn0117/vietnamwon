import "server-only";

export type Post = {
  id: string;
  category: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

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

async function rest(path: string, init?: RequestInit & { write?: boolean }) {
  const { write, ...rest } = init ?? {};
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...rest,
    headers: { ...headers(write), ...(rest.headers ?? {}) },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return response;
}

export async function listPosts(category?: string, includeDrafts = false) {
  const filters = ["select=*", "order=sort_order.asc,created_at.desc"];
  if (category) filters.push(`category=eq.${encodeURIComponent(category)}`);
  if (!includeDrafts) filters.push("published=eq.true");
  const response = await rest(`posts?${filters.join("&")}`);
  return (await response.json()) as Post[];
}

export async function getPost(category: string, slug: string, includeDrafts = false) {
  const filters = [
    "select=*",
    `category=eq.${encodeURIComponent(category)}`,
    `slug=eq.${encodeURIComponent(slug)}`,
    "limit=1",
  ];
  if (!includeDrafts) filters.push("published=eq.true");
  const response = await rest(`posts?${filters.join("&")}`);
  const rows = (await response.json()) as Post[];
  return rows[0] ?? null;
}

export async function getPostById(id: string) {
  const response = await rest(`posts?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
  const rows = (await response.json()) as Post[];
  return rows[0] ?? null;
}

export async function createPost(values: Partial<Post>) {
  await rest("posts", {
    method: "POST",
    write: true,
    body: JSON.stringify(values),
  });
}

export async function updatePost(id: string, values: Partial<Post>) {
  await rest(`posts?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    write: true,
    body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }),
  });
}

export async function deletePost(id: string) {
  await rest(`posts?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", write: true });
}

export async function uploadCover(file: File) {
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
