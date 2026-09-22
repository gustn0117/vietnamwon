import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageFooter } from "@/components/PageFooter";
import { PageHeader } from "@/components/PageHeader";
import { casinoBoards } from "@/lib/boards";
import { listPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "베트남 카지노 안내 | ONE AGENCY",
  description: "나트랑, 다낭, 하노이 카지노를 도시별로 안내합니다.",
};

export const dynamic = "force-dynamic";

export default async function CasinoIndexPage() {
  const posts = await listPosts();

  return (
    <>
      <PageHeader />
      <main className="article-main">
        <section className="page-head">
          <div className="shell">
            <h1>베트남 카지노</h1>
            <p>도시를 선택하면 해당 지역 카지노 안내 글을 볼 수 있습니다.</p>
          </div>
        </section>

        <section className="shell city-index">
          {casinoBoards.map((city) => {
            const count = posts.filter((post) => post.category === city.slug).length;
            return (
              <Link className="city-card" key={city.slug} href={city.href}>
                <div>
                  <h2>{city.heading}</h2>
                  <p>{city.description}</p>
                </div>
                <span>글 {count}개 <ArrowRight /></span>
              </Link>
            );
          })}
        </section>
      </main>
      <PageFooter />
    </>
  );
}
