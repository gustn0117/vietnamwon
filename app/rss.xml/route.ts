import { listPosts } from "@/lib/posts";
import { absolute, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import { boardHref, getSiteData } from "@/lib/site";

export const dynamic = "force-dynamic";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const stripTags = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export async function GET() {
  const [site, posts] = await Promise.all([getSiteData(), listPosts()]);

  const items = posts
    .map((post) => {
      const board = site.boards.find((item) => item.slug === post.category);
      if (!board) return "";
      const link = absolute(`${boardHref(board, site.boards)}/${post.slug}`);
      const summary = post.excerpt || stripTags(post.body).slice(0, 200);
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <category>${escape(board.heading)}</category>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <description>${escape(summary)}</description>
    </item>`;
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escape(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absolute("/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=600",
    },
  });
}
