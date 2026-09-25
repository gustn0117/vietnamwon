import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BoardView } from "@/components/BoardView";
import { listPosts } from "@/lib/posts";
import { getSiteData } from "@/lib/site";

type Props = { params: Promise<{ board: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { board: slug } = await params;
  const site = await getSiteData();
  const board = site.boards.find((item) => item.slug === slug && item.grp === "main");
  if (!board) return {};
  return { title: `${board.heading} | ONE AGENCY`, description: board.description };
}

export const dynamic = "force-dynamic";

export default async function BoardPage({ params }: Props) {
  const { board: slug } = await params;
  const site = await getSiteData();
  const board = site.boards.find((item) => item.slug === slug && item.grp === "main");
  if (!board) notFound();

  return <BoardView site={site} board={board} posts={await listPosts(board.slug)} />;
}
