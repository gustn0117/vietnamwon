import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isSignedIn } from "@/lib/session";
import { PostForm } from "../../PostForm";

export const metadata: Metadata = {
  title: "새 글 쓰기 | ONE AGENCY",
  robots: { index: false, follow: false },
};

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  if (!(await isSignedIn())) redirect("/admin");

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <header className="admin-head">
          <h1>새 글 쓰기</h1>
          <Link className="outline-button" href="/admin">목록으로</Link>
        </header>
        <PostForm defaultCategory={(await searchParams).category} />
      </div>
    </main>
  );
}
