import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getPostById } from "@/lib/posts";
import { isSignedIn } from "@/lib/session";
import { PostForm } from "../../PostForm";

export const metadata: Metadata = {
  title: "글 수정 | ONE AGENCY",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isSignedIn())) redirect("/admin");

  const post = await getPostById((await params).id);
  if (!post) notFound();

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <header className="admin-head">
          <h1>글 수정</h1>
          <Link className="outline-button" href="/admin">목록으로</Link>
        </header>
        <PostForm post={post} />
      </div>
    </main>
  );
}
