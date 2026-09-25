import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { isSignedIn } from "@/lib/session";
import { getBoard } from "@/lib/site";
import { AdminNav } from "../../AdminNav";
import { BoardForm } from "../../BoardForm";

export const metadata: Metadata = {
  title: "게시판 수정 | ONE AGENCY",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditBoardPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isSignedIn())) redirect("/admin");

  const board = await getBoard((await params).slug);
  if (!board) notFound();

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <AdminNav current="boards" />
        <header className="admin-head">
          <h1>게시판 수정</h1>
          <Link className="outline-button" href="/admin/boards">목록으로</Link>
        </header>
        <BoardForm board={board} />
      </div>
    </main>
  );
}
