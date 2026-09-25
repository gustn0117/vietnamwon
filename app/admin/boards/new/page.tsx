import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isSignedIn } from "@/lib/session";
import { AdminNav } from "../../AdminNav";
import { BoardForm } from "../../BoardForm";

export const metadata: Metadata = {
  title: "게시판 추가 | ONE AGENCY",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewBoardPage() {
  if (!(await isSignedIn())) redirect("/admin");

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <AdminNav current="boards" />
        <header className="admin-head">
          <h1>게시판 추가</h1>
          <Link className="outline-button" href="/admin/boards">목록으로</Link>
        </header>
        <BoardForm />
      </div>
    </main>
  );
}
