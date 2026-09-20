import Link from "next/link";
import type { Metadata } from "next";
import { casinoCities } from "@/lib/casino";
import { listPosts } from "@/lib/posts";
import { isSignedIn } from "@/lib/session";
import { removePost, signOut } from "./actions";
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

  const posts = await listPosts(undefined, true);

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <header className="admin-head">
          <h1>카지노 글 관리</h1>
          <div className="admin-head-actions">
            <Link className="gold-button" href="/admin/posts/new">새 글 쓰기</Link>
            <form action={signOut}>
              <button className="outline-button" type="submit">로그아웃</button>
            </form>
          </div>
        </header>

        {casinoCities.map((city) => {
          const cityPosts = posts.filter((post) => post.city === city.slug);
          return (
            <section className="admin-group" key={city.slug}>
              <h2>{city.heading} <span>{cityPosts.length}개</span></h2>
              {cityPosts.length ? (
                <ul className="admin-list">
                  {cityPosts.map((post) => (
                    <li key={post.id}>
                      <div>
                        <strong>{post.title}</strong>
                        <small>
                          /casino/{city.slug}/{post.slug}
                          {!post.published && " · 비공개"}
                        </small>
                      </div>
                      <div className="admin-list-actions">
                        <Link href={`/admin/posts/${post.id}`}>수정</Link>
                        <Link href={`/casino/${city.slug}/${post.slug}`}>보기</Link>
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
