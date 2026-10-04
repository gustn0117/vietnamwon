"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPost, deletePost, getPostById, updatePost } from "@/lib/posts";
import { cleanHtml } from "@/lib/html";
import { pingIndexNow } from "@/lib/indexnow";
import { absolute } from "@/lib/seo";
import { checkPassword, endSession, requireSession, startSession } from "@/lib/session";
import {
  boardHref,
  deleteBoard as removeBoardRow,
  getBoard,
  listBoards,
  saveBoard,
  saveSettings,
} from "@/lib/site";

export type FormState = { error?: string; ok?: string };

function slugify(input: string) {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-");
  return cleaned || `post-${Date.now()}`;
}

function refreshAll() {
  revalidatePath("/", "layout");
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
  const category = String(formData.get("category") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = cleanHtml(String(formData.get("body") ?? "").replace(/\r\n/g, "\n").trim());
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const published = formData.get("published") === "on";
  const sortOrder = Number(formData.get("sort_order") ?? 0) || 0;
  const slugInput = String(formData.get("slug") ?? "").trim();
  const coverUrl = String(formData.get("cover_url") ?? "").trim() || null;
  const images = formData.getAll("keep_image").map(String).filter(Boolean);

  const boards = await listBoards(true);
  if (!boards.some((board) => board.slug === category)) return { error: "게시판을 선택해주세요." };
  if (!title) return { error: "제목을 입력해주세요." };

  const slug = slugify(slugInput || title);
  const values = { category, title, body, excerpt, slug, published, sort_order: sortOrder, images };

  try {
    if (id) {
      const existing = await getPostById(id);
      if (!existing) return { error: "글을 찾을 수 없습니다." };
      await updatePost(id, { ...values, cover_url: coverUrl });
    } else {
      await createPost({ ...values, cover_url: coverUrl });
    }
  } catch (error) {
    if (String(error).includes("duplicate key")) return { error: "이 게시판에 같은 주소(slug)의 글이 이미 있습니다." };
    return { error: "저장하지 못했습니다. 잠시 후 다시 시도해주세요." };
  }

  refreshAll();

  const board = (await listBoards(true)).find((item) => item.slug === category);
  if (board && published) {
    const boards = await listBoards(true);
    const path = board.parent
      ? `/${boards.find((item) => item.slug === board.parent)?.segment ?? board.parent}/${board.segment}`
      : `/${board.segment}`;
    await pingIndexNow([absolute(`${path}/${slug}`), absolute(path), absolute("/")]);
  }

  redirect("/admin");
}

export async function removePost(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const post = await getPostById(id);
  if (!post) return;
  await deletePost(id);
  refreshAll();
  redirect("/admin");
}

const TEXT_FIELDS = [
  "utility_text",
  "hero_title_1",
  "hero_title_2",
  "hero_copy",
  "hero_trust_1",
  "hero_trust_2",
  "hero_trust_3",
  "signature_title",
  "signature_copy",
  "experience_heading",
  "experience_copy",
  "promise_heading",
  "promise_copy",
  "banner_heading",
  "banner_copy",
  "kakao_url",
  "telegram_url",
  "partners_title",
  "guide_title",
];

const IMAGE_FIELDS = ["hero_image", "banner_image"];

export async function saveSite(_state: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const values: Record<string, string> = {};
  for (const field of TEXT_FIELDS) values[field] = String(formData.get(field) ?? "").replace(/\r\n/g, "\n").trim();

  for (const field of IMAGE_FIELDS) values[field] = String(formData.get(field) ?? "").trim();
  values.partner_logos = JSON.stringify(formData.getAll("partner_logos").map(String).filter(Boolean));
  values.guide_images = JSON.stringify(formData.getAll("guide_images").map(String).filter(Boolean));

  await saveSettings(values);
  refreshAll();
  return { ok: "저장했습니다." };
}

export async function saveBoardAction(_state: FormState, formData: FormData): Promise<FormState> {
  await requireSession();

  const original = String(formData.get("original_slug") ?? "");
  const parent = String(formData.get("parent") ?? "").trim() || null;
  const segment = slugify(String(formData.get("segment") ?? ""));
  const slug = original || (parent ? `${parent}-${segment}` : segment);
  const name = String(formData.get("name") ?? "").trim();
  const heading = String(formData.get("heading") ?? "").trim() || name;

  if (!name) return { error: "메뉴 이름을 입력해주세요." };
  if (!/^[a-z0-9-]+$/.test(segment)) return { error: "주소는 영문 소문자, 숫자, 하이픈만 쓸 수 있습니다." };

  const isNew = !original;
  if (isNew && (await getBoard(slug))) return { error: "같은 주소의 메뉴가 이미 있습니다." };

  const values: Record<string, unknown> = {
    name,
    heading,
    description: String(formData.get("description") ?? "").replace(/\r\n/g, "\n").trim(),
    grp: "main",
    parent,
    segment,
    menu_show: formData.get("menu_show") === "on",
    feature_link: formData.get("feature_link") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    visible: formData.get("visible") === "on",
    card_show: formData.get("card_show") === "on",
    card_subtitle: String(formData.get("card_subtitle") ?? "").trim(),
    card_icon: String(formData.get("card_icon") ?? "spade"),
    card_image: String(formData.get("card_image") ?? "").trim() || null,
    feature_title: String(formData.get("feature_title") ?? "").trim() || null,
    feature_copy: String(formData.get("feature_copy") ?? "").trim() || null,
    feature_image: String(formData.get("feature_image") ?? "").trim() || null,
  };

  try {
    await saveBoard(isNew ? slug : original, isNew ? values : { ...values, slug }, isNew);
  } catch {
    return { error: "저장하지 못했습니다. 주소(slug)가 겹치지 않는지 확인해주세요." };
  }

  refreshAll();
  redirect("/admin/boards");
}

export async function removeBoard(formData: FormData) {
  await requireSession();
  const slug = String(formData.get("slug") ?? "");
  const board = await getBoard(slug);
  if (!board) return;
  await removeBoardRow(slug);
  refreshAll();
  redirect("/admin/boards");
}

export { boardHref };
