import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BoardView } from "@/components/BoardView";
import { PostView } from "@/components/PostView";
import { getPost, listPosts } from "@/lib/posts";
import { boardHref, decodeParam, findBySegment, getSiteData } from "@/lib/site";

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
  const path = boardHref(data.board, data.site.boards);
  if (data.kind === "board") {
    return {
      title: `${data.board.heading} | ONE AGENCY`,
      description: data.board.description,
      alternates: { canonical: path },
      openGraph: { title: data.board.heading, description: data.board.description, url: path },
    };
  }
  const description = data.post.excerpt || data.board.description;
  const url = `${path}/${data.post.slug}`;
  return {
    title: `${data.post.title} | ONE AGENCY`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: data.post.title,
      description,
      url,
      publishedTime: data.post.created_at,
      images: data.post.cover_url ? [data.post.cover_url] : undefined,
    },
  };
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
