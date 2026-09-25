import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isSignedIn } from "@/lib/session";
import { listBoards } from "@/lib/site";
import { AdminNav } from "../../AdminNav";
import { PostForm } from "../../PostForm";

export const metadata: Metadata = {
  title: "새 글 쓰기 | ONE AGENCY",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  if (!(await isSignedIn())) redirect("/admin");
  const boards = await listBoards(true);

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <AdminNav current="posts" />
        <header className="admin-head">
          <h1>새 글 쓰기</h1>
          <Link className="outline-button" href="/admin">목록으로</Link>
        </header>
        <PostForm boards={boards} defaultCategory={(await searchParams).category} bodyHtml="" />
      </div>
    </main>
  );
}
