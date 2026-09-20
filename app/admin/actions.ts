"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { casinoCities } from "@/lib/casino";
import { createPost, deletePost, getPostById, updatePost, uploadCover } from "@/lib/posts";
import { checkPassword, endSession, requireSession, startSession } from "@/lib/session";

export type FormState = { error?: string };

function slugify(input: string) {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-");
  return cleaned || `post-${Date.now()}`;
}

function refresh(city: string, slug?: string) {
  revalidatePath("/casino");
  revalidatePath(`/casino/${city}`);
  if (slug) revalidatePath(`/casino/${city}/${slug}`);
  revalidatePath("/admin");
}

export async function signIn(_state: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "비밀번호가 맞지 않습니다." };
  await startSession();
  redirect("/admin");
}

export async function signOut() {
  await endSession();
  redirect("/admin");
}

export async function savePost(_state: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const city = String(formData.get("city") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const published = formData.get("published") === "on";
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  const slugInput = String(formData.get("slug") ?? "").trim();
  const cover = formData.get("cover");
  const removeCover = formData.get("remove_cover") === "on";

  if (!casinoCities.some((item) => item.slug === city)) return { error: "도시를 선택해주세요." };
  if (!title) return { error: "제목을 입력해주세요." };

  let coverUrl: string | null | undefined;
  if (removeCover) coverUrl = null;
  if (cover instanceof File && cover.size > 0) {
    if (!cover.type.startsWith("image/")) return { error: "사진 파일만 올릴 수 있습니다." };
    try {
      coverUrl = await uploadCover(cover);
    } catch {
      return { error: "사진 업로드에 실패했습니다. 잠시 후 다시 시도해주세요." };
    }
  }

  const slug = slugify(slugInput || title);
  const values = { city, title, body, excerpt, slug, published, sort_order: sortOrder };

  try {
    if (id) {
      const existing = await getPostById(id);
      if (!existing) return { error: "글을 찾을 수 없습니다." };
      await updatePost(id, { ...values, ...(coverUrl !== undefined ? { cover_url: coverUrl } : {}) });
      if (existing.city !== city || existing.slug !== slug) refresh(existing.city, existing.slug);
    } else {
      await createPost({ ...values, cover_url: coverUrl ?? null });
    }
  } catch (error) {
    const message = String(error);
    if (message.includes("duplicate key")) return { error: "같은 주소(slug)의 글이 이미 있습니다." };
    return { error: "저장하지 못했습니다. 잠시 후 다시 시도해주세요." };
  }

  refresh(city, slug);
  redirect("/admin");
}

export async function removePost(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const post = await getPostById(id);
  if (!post) return;
  await deletePost(id);
  refresh(post.city, post.slug);
  redirect("/admin");
}
