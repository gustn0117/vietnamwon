import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostView } from "@/components/PostView";
import { getPost } from "@/lib/posts";
import { decodeParam, getSiteData } from "@/lib/site";

type Props = { params: Promise<{ board: string; slug: string }> };

async function load(params: Props["params"]) {
  const { board: boardParam, slug: slugParam } = await params;
  const boardSlug = decodeParam(boardParam);
  const slug = decodeParam(slugParam);
  const site = await getSiteData();
  const board = site.boards.find((item) => item.slug === boardSlug && item.grp === "main");
  if (!board) return null;
  const post = await getPost(board.slug, slug);
  return post ? { site, board, post } : null;
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
  return <PostView site={data.site} board={data.board} post={data.post} />;
}
