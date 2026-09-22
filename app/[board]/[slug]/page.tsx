import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostView } from "@/components/PostView";
import { findBoard } from "@/lib/boards";
import { getPost } from "@/lib/posts";

type Props = { params: Promise<{ board: string; slug: string }> };

async function load(params: Props["params"]) {
  const { board: boardSlug, slug } = await params;
  const board = findBoard(boardSlug, "main");
  if (!board) return null;
  const post = await getPost(board.slug, slug);
  return post ? { board, post } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  return { title: `${data.post.title} | ONE AGENCY`, description: data.post.excerpt || data.board.description };
}

export const dynamic = "force-dynamic";

export default async function BoardPostPage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();
  return <PostView board={data.board} post={data.post} />;
}
