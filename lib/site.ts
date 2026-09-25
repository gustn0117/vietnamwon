import "server-only";

import { rest } from "@/lib/rest";

export type Board = {
  slug: string;
  name: string;
  heading: string;
  description: string;
  grp: "casino" | "main";
  sort_order: number;
  visible: boolean;
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

export const boardHref = (board: Pick<Board, "slug" | "grp">) =>
  board.grp === "casino" ? `/casino/${board.slug}` : `/${board.slug}`;

export async function listBoards(includeHidden = false) {
  const response = await rest(`boards?select=*&order=grp.asc,sort_order.asc`);
  const boards = (await response.json()) as Board[];
  return includeHidden ? boards : boards.filter((board) => board.visible);
}

export async function getBoard(slug: string, grp?: Board["grp"]) {
  const boards = await listBoards(true);
  return boards.find((board) => board.slug === slug && (!grp || board.grp === grp)) ?? null;
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
