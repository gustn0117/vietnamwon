import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/posts";
import { absolute } from "@/lib/seo";
import { boardHref, getSiteData } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, posts] = await Promise.all([getSiteData(), listPosts()]);

  const boards = site.boards.map((board) => ({
    url: absolute(boardHref(board, site.boards)),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: board.parent ? 0.7 : 0.8,
  }));

  const postPages = posts.flatMap((post) => {
    const board = site.boards.find((item) => item.slug === post.category);
    if (!board) return [];
    return [{
      url: absolute(`${boardHref(board, site.boards)}/${post.slug}`),
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }];
  });

  return [
    { url: absolute("/"), lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...boards,
    ...postPages,
  ];
}
