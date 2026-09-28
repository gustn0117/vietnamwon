import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostView } from "@/components/PostView";
import { getPost } from "@/lib/posts";
import { decodeParam, findBySegment, getSiteData } from "@/lib/site";

type Props = { params: Promise<{ board: string; slug: string; post: string }> };

async function load(params: Props["params"]) {
  const { board: boardParam, slug: subParam, post: postParam } = await params;
  const site = await getSiteData();
  const parent = findBySegment(site.boards, decodeParam(boardParam));
  if (!parent) return null;
  const board = findBySegment(site.boards, decodeParam(subParam), parent.slug);
  if (!board) return null;
  const post = await getPost(board.slug, decodeParam(postParam));
  return post ? { site, board, post } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  return { title: `${data.post.title} | ONE AGENCY`, description: data.post.excerpt || data.board.description };
}

export const dynamic = "force-dynamic";

export default async function ChildPostPage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();
  return <PostView site={data.site} board={data.board} post={data.post} />;
}
