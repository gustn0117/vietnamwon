import Link from "next/link";
import type { Metadata } from "next";
import { listPosts } from "@/lib/posts";
import { isSignedIn } from "@/lib/session";
import { boardHref, listBoards } from "@/lib/site";
import { AdminNav } from "./AdminNav";
import { removePost } from "./actions";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "글 관리 | ONE AGENCY",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isSignedIn())) {
    return (
      <main className="admin-main admin-center">
        <LoginForm />
      </main>
    );
  }

  const [boards, posts] = await Promise.all([listBoards(true), listPosts(undefined, true)]);

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <AdminNav current="posts" />
        <header className="admin-head">
          <h1>글 관리</h1>
          <Link className="gold-button" href="/admin/posts/new">새 글 쓰기</Link>
        </header>

        {boards.map((board) => {
          const boardPosts = posts.filter((post) => post.category === board.slug);
          return (
            <section className="admin-group" key={board.slug}>
              <h2>
                {board.heading} <span>{boardPosts.length}개</span>
                <Link className="admin-add" href={`/admin/posts/new?category=${board.slug}`}>+ 이 게시판에 글쓰기</Link>
              </h2>
              {boardPosts.length ? (
                <ul className="admin-list">
                  {boardPosts.map((post) => (
                    <li key={post.id}>
                      <div>
                        <strong>{post.title}</strong>
                        <small>
                          {boardHref(board)}/{post.slug}
                          {!post.published && " · 비공개"}
                        </small>
                      </div>
                      <div className="admin-list-actions">
                        <Link href={`/admin/posts/${post.id}`}>수정</Link>
                        <Link href={`${boardHref(board)}/${post.slug}`} target="_blank">보기</Link>
                        <form action={removePost}>
                          <input type="hidden" name="id" value={post.id} />
                          <button type="submit">삭제</button>
                        </form>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-empty">아직 글이 없습니다.</p>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
