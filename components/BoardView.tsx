import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { boardHref, childrenOf, type Board, type SiteData } from "@/lib/site";
import type { Post } from "@/lib/posts";

type Props = {
  site: SiteData;
  board: Board;
  posts: Post[];
};

export function BoardView({ site, board, posts }: Props) {
  const href = boardHref(board, site.boards);
  const children = childrenOf(site.boards, board.slug);
  const parent = board.parent ? site.boards.find((item) => item.slug === board.parent) : null;
  const siblings = site.boards.filter(
    (item) => (item.parent ?? null) === (board.parent ?? null) && item.slug !== board.slug && item.menu_show,
  );

  return (
    <>
      <SiteHeader site={site} />
      <main className="article-main">
        <nav className="crumbs shell" aria-label="현재 위치">
          <Link href="/">홈</Link> <CaretRight aria-hidden="true" />{" "}
          {parent && (
            <>
              <Link href={boardHref(parent, site.boards)}>{parent.name}</Link> <CaretRight aria-hidden="true" />{" "}
            </>
          )}
          <span>{board.name}</span>
        </nav>

        <section className="page-head">
          <div className="shell">
            <h1>{board.heading}</h1>
            {board.description && <p>{board.description}</p>}
          </div>
        </section>

        {children.length > 0 && (
          <section className="shell city-index">
            {children.map((child) => (
              <Link className="city-card" key={child.slug} href={boardHref(child, site.boards)}>
                <div>
                  <h2>{child.heading}</h2>
                  {child.description && <p>{child.description}</p>}
                </div>
                <span>글 보기 <ArrowRight /></span>
              </Link>
            ))}
          </section>
        )}

        {(posts.length > 0 || children.length === 0) && (
          <section className="shell post-list">
            {posts.length ? (
              posts.map((post) => (
                <Link className="post-card" key={post.id} href={`${href}/${post.slug}`}>
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
        )}

        {siblings.length > 0 && (
          <section className="city-switch shell" aria-label="다른 메뉴 보기">
            {siblings.map((item) => (
              <Link key={item.slug} href={boardHref(item, site.boards)}>{item.heading} <ArrowRight /></Link>
            ))}
          </section>
        )}
      </main>
      <SiteFooter site={site} />
    </>
  );
}
