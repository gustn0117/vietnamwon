import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostView } from "@/components/PostView";
import { getPost } from "@/lib/posts";
import { boardHref, decodeParam, findBySegment, getSiteData } from "@/lib/site";

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
  const description = data.post.excerpt || data.board.description;
  const url = `${boardHref(data.board, data.site.boards)}/${data.post.slug}`;
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

export default async function ChildPostPage({ params }: Props) {
  const data = await load(params);
  if (!data) notFound();
  return <PostView site={data.site} board={data.board} post={data.post} />;
}
