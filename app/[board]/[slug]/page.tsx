import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BoardView } from "@/components/BoardView";
import { PostView } from "@/components/PostView";
import { getPost, listPosts } from "@/lib/posts";
import { decodeParam, findBySegment, getSiteData } from "@/lib/site";

type Props = { params: Promise<{ board: string; slug: string }> };

async function load(params: Props["params"]) {
  const { board: boardParam, slug: slugParam } = await params;
  const segment = decodeParam(boardParam);
  const slug = decodeParam(slugParam);
  const site = await getSiteData();

  const parent = findBySegment(site.boards, segment);
  if (!parent) return null;

  const child = findBySegment(site.boards, slug, parent.slug);
  if (child) return { kind: "board" as const, site, board: child };

  const post = await getPost(parent.slug, slug);
  return post ? { kind: "post" as const, site, board: parent, post } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load(params);
  if (!data) return {};
  if (data.kind === "board") {
    return { title: `${data.board.heading} | ONE AGENCY`, description: data.board.description };
  }
  return { title: `${data.post.title} | ONE AGENCY`, description: data.post.excerpt || data.board.description };
}

export const dynamic = "force-dynamic";

export default async function BoardOrPostPage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();

  if (data.kind === "board") {
    return <BoardView site={data.site} board={data.board} posts={await listPosts(data.board.slug)} />;
  }
  return <PostView site={data.site} board={data.board} post={data.post} />;
}
