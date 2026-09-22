import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BoardView } from "@/components/BoardView";
import { findBoard, mainBoards } from "@/lib/boards";
import { listPosts } from "@/lib/posts";

type Props = { params: Promise<{ board: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const board = findBoard((await params).board, "main");
  if (!board) return {};
  return { title: `${board.heading} | ONE AGENCY`, description: board.description };
}

export const dynamic = "force-dynamic";

export default async function BoardPage({ params }: Props) {
  const board = findBoard((await params).board, "main");
  if (!board) notFound();

  return <BoardView board={board} posts={await listPosts(board.slug)} siblings={mainBoards} />;
}
