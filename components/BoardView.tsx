import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { PageFooter } from "@/components/PageFooter";
import { PageHeader } from "@/components/PageHeader";
import type { Board } from "@/lib/boards";
import type { Post } from "@/lib/posts";

type Props = {
  board: Board;
  posts: Post[];
  siblings: Board[];
};

export function BoardView({ board, posts, siblings }: Props) {
  return (
    <>
      <PageHeader />
      <main className="article-main">
        <nav className="crumbs shell" aria-label="현재 위치">
          {board.group === "casino" ? (
            <>
              <Link href="/casino">카지노</Link> <CaretRight aria-hidden="true" /> <span>{board.name}</span>
            </>
          ) : (
            <>
              <Link href="/">홈</Link> <CaretRight aria-hidden="true" /> <span>{board.name}</span>
            </>
          )}
        </nav>

        <section className="page-head">
          <div className="shell">
            <h1>{board.heading}</h1>
            <p>{board.description}</p>
          </div>
        </section>

        <section className="shell post-list">
          {posts.length ? (
            posts.map((post) => (
              <Link className="post-card" key={post.id} href={`${board.href}/${post.slug}`}>
                <div className="post-thumb">
                  {post.cover_url ? (
                    <Image src={post.cover_url} alt="" fill sizes="(max-width: 760px) 100vw, 420px" />
                  ) : (
                    <span className="hatch" aria-hidden="true"><em>대표 사진 자리</em></span>
                  )}
                </div>
                <div className="post-text">
                  <h2>{post.title}</h2>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  <span>자세히 보기 <ArrowRight /></span>
                </div>
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <h2>아직 등록된 글이 없습니다</h2>
              <p>{board.heading} 안내 글을 준비하고 있습니다.</p>
            </div>
          )}
        </section>

        <section className="city-switch shell" aria-label="다른 게시판 보기">
          {siblings
            .filter((item) => item.slug !== board.slug)
            .map((item) => (
              <Link key={item.slug} href={item.href}>{item.heading} <ArrowRight /></Link>
            ))}
        </section>
      </main>
      <PageFooter />
    </>
  );
}
