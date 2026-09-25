import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { listPosts } from "@/lib/posts";
import { isSignedIn } from "@/lib/session";
import { boardHref, listBoards } from "@/lib/site";
import { AdminNav } from "../AdminNav";
import { removeBoard } from "../actions";

export const metadata: Metadata = {
  title: "게시판 관리 | ONE AGENCY",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminBoardsPage() {
  if (!(await isSignedIn())) redirect("/admin");

  const [boards, posts] = await Promise.all([listBoards(true), listPosts(undefined, true)]);

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <AdminNav current="boards" />
        <header className="admin-head">
          <h1>게시판 관리</h1>
          <Link className="gold-button" href="/admin/boards/new">게시판 추가</Link>
        </header>

        <ul className="admin-list">
          {boards.map((board) => {
            const count = posts.filter((post) => post.category === board.slug).length;
            return (
              <li key={board.slug}>
                <div>
                  <strong>{board.name}</strong>
                  <small>
                    {boardHref(board)} · 글 {count}개 · {board.grp === "casino" ? "카지노 하위" : "상단 메뉴"}
                    {!board.visible && " · 숨김"}
                  </small>
                </div>
                <div className="admin-list-actions">
                  <Link href={`/admin/boards/${board.slug}`}>수정</Link>
                  <Link href={boardHref(board)} target="_blank">보기</Link>
                  <form action={removeBoard}>
                    <input type="hidden" name="slug" value={board.slug} />
                    <button type="submit" disabled={count > 0} title={count > 0 ? "글을 모두 지운 뒤 삭제할 수 있습니다" : undefined}>
                      삭제
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
