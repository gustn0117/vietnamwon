import Image from "next/image";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { ContactButtons } from "@/components/ContactButtons";
import { PageFooter } from "@/components/PageFooter";
import { PageHeader } from "@/components/PageHeader";
import type { Board } from "@/lib/boards";
import type { Post } from "@/lib/posts";

export function PostView({ board, post }: { board: Board; post: Post }) {
  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <PageHeader />
      <main className="article-main">
        <nav className="crumbs shell" aria-label="현재 위치">
          {board.group === "casino" ? <Link href="/casino">카지노</Link> : <Link href="/">홈</Link>}{" "}
          <CaretRight aria-hidden="true" /> <Link href={board.href}>{board.name}</Link>{" "}
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
            {post.body
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((block, index) => (
                <p key={index}>
                  {block.split("\n").map((line, lineIndex, lines) => (
                    <span key={lineIndex}>
                      {line}
                      {lineIndex < lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
          </div>

          <div className="article-cta">
            <div>
              <h2>궁금한 점은 바로 물어보세요</h2>
              <p>카카오톡이나 텔레그램으로 날짜와 인원을 보내주시면 바로 안내해 드립니다.</p>
            </div>
            <ContactButtons className="contact-buttons article-contact" />
          </div>

          <Link className="article-back" href={board.href}>{board.heading} 글 목록으로</Link>
        </article>
      </main>
      <PageFooter />
    </>
  );
}
