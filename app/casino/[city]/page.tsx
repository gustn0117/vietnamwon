import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BoardView } from "@/components/BoardView";
import { listPosts } from "@/lib/posts";
import { decodeParam, getSiteData } from "@/lib/site";

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = decodeParam((await params).city);
  const site = await getSiteData();
  const board = site.boards.find((item) => item.slug === city && item.grp === "casino");
  if (!board) return {};
  return { title: `${board.heading} | ONE AGENCY`, description: board.description };
}

export const dynamic = "force-dynamic";

export default async function CasinoCityPage({ params }: Props) {
  const city = decodeParam((await params).city);
  const site = await getSiteData();
  const board = site.boards.find((item) => item.slug === city && item.grp === "casino");
  if (!board) notFound();

  return <BoardView site={site} board={board} posts={await listPosts(board.slug)} />;
}
