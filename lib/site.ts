import "server-only";

import { rest } from "@/lib/rest";

export type Board = {
  slug: string;
  name: string;
  heading: string;
  description: string;
  grp: string;
  parent: string | null;
  segment: string;
  sort_order: number;
  visible: boolean;
  menu_show: boolean;
  feature_link: boolean;
  card_show: boolean;
  card_subtitle: string;
  card_image: string | null;
  card_icon: string;
  card_position: string | null;
  feature_title: string | null;
  feature_copy: string | null;
  feature_image: string | null;
};

export type Settings = Record<string, string>;

export type SiteData = {
  boards: Board[];
  settings: Settings;
};

export function decodeParam(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function boardHref(board: Pick<Board, "segment" | "parent">, boards: Board[] = []) {
  if (!board.parent) return `/${board.segment}`;
  const parent = boards.find((item) => item.slug === board.parent);
  return `/${parent?.segment ?? board.parent}/${board.segment}`;
}

export const topBoards = (boards: Board[]) => boards.filter((board) => !board.parent);
export const childrenOf = (boards: Board[], slug: string) => boards.filter((board) => board.parent === slug);

export function findBySegment(boards: Board[], segment: string, parentSlug: string | null = null) {
  return boards.find((board) => board.segment === segment && (board.parent ?? null) === parentSlug) ?? null;
}

export async function listBoards(includeHidden = false) {
  const response = await rest(`boards?select=*&order=sort_order.asc`);
  const boards = (await response.json()) as Board[];
  return includeHidden ? boards : boards.filter((board) => board.visible);
}

export async function getBoard(slug: string) {
  const boards = await listBoards(true);
  return boards.find((board) => board.slug === slug) ?? null;
}

export async function getSettings(): Promise<Settings> {
  const response = await rest("settings?select=key,value");
  const rows = (await response.json()) as { key: string; value: string }[];
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function getSiteData(): Promise<SiteData> {
  const [boards, settings] = await Promise.all([listBoards(), getSettings()]);
  return { boards, settings };
}

export async function saveSettings(values: Settings) {
  const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
  if (!rows.length) return;
  await rest("settings", {
    method: "POST",
    write: true,
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(rows),
  });
}

export async function saveBoard(slug: string, values: Partial<Board>, isNew: boolean) {
  if (isNew) {
    await rest("boards", { method: "POST", write: true, body: JSON.stringify({ ...values, slug }) });
    return;
  }
  await rest(`boards?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    write: true,
    body: JSON.stringify(values),
  });
}

export async function deleteBoard(slug: string) {
  await rest(`boards?slug=eq.${encodeURIComponent(slug)}`, { method: "DELETE", write: true });
}

export function contactLinks(settings: Settings) {
  return {
    kakao: settings.kakao_url || "",
    telegram: settings.telegram_url || "",
  };
}

export type Contact = ReturnType<typeof contactLinks>;
