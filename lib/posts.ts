import "server-only";

import { rest, uploadImage } from "@/lib/rest";

export type Post = {
  id: string;
  category: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  images: string[];
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

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
  await rest("posts", { method: "POST", write: true, body: JSON.stringify(values) });
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

export const uploadCover = uploadImage;
