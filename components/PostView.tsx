import Image from "next/image";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { ContactButtons } from "@/components/ContactButtons";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { boardHref, contactLinks, type Board, type SiteData } from "@/lib/site";
import type { Post } from "@/lib/posts";

const IMAGE_TOKEN = /^\[사진\s*(\d+)\]$/;

function renderBody(body: string, images: string[]) {
  const used = new Set<number>();
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const match = block.match(IMAGE_TOKEN);
      if (match) {
        const position = Number(match[1]) - 1;
        const src = images[position];
        if (!src) return null;
        used.add(position);
        return (
          <figure className="article-figure" key={`img-${index}`}>
            <Image src={src} alt="" width={1200} height={800} sizes="(max-width: 1080px) 100vw, 1000px" />
          </figure>
        );
      }
      return (
        <p key={`p-${index}`}>
          {block.split("\n").map((line, lineIndex, lines) => (
            <span key={lineIndex}>
              {line}
              {lineIndex < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      );
    })
    .filter(Boolean);

  const rest = images.filter((_, index) => !used.has(index));
  return { blocks, rest };
}

export function PostView({ site, board, post }: { site: SiteData; board: Board; post: Post }) {
  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const images = Array.isArray(post.images) ? post.images : [];
  const { blocks, rest } = renderBody(post.body, images);

  return (
    <>
      <SiteHeader site={site} />
      <main className="article-main">
        <nav className="crumbs shell" aria-label="현재 위치">
          {board.grp === "casino" ? <Link href="/casino">카지노</Link> : <Link href="/">홈</Link>}{" "}
          <CaretRight aria-hidden="true" /> <Link href={boardHref(board)}>{board.name}</Link>{" "}
          <CaretRight aria-hidden="true" /> <span>{post.title}</span>
        </nav>

        <article className="shell article">
          <h1>{post.title}</h1>
          <p className="article-date">{date}</p>

          {post.cover_url && (
            <div className="article-cover">
              <Image src={post.cover_url} alt="" fill sizes="(max-width: 1080px) 100vw, 1000px" priority />
            </div>
          )}

          <div className="article-body">
            {blocks}
            {rest.map((src) => (
              <figure className="article-figure" key={src}>
                <Image src={src} alt="" width={1200} height={800} sizes="(max-width: 1080px) 100vw, 1000px" />
              </figure>
            ))}
          </div>

          <div className="article-cta">
            <div>
              <h2>궁금한 점은 바로 물어보세요</h2>
              <p>카카오톡이나 텔레그램으로 날짜와 인원을 보내주시면 바로 안내해 드립니다.</p>
            </div>
            <ContactButtons contact={contactLinks(site.settings)} className="contact-buttons article-contact" />
          </div>

          <Link className="article-back" href={boardHref(board)}>{board.heading} 글 목록으로</Link>
        </article>
      </main>
      <SiteFooter site={site} />
    </>
  );
}
