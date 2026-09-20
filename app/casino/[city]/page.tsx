import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { PageFooter } from "@/components/PageFooter";
import { PageHeader } from "@/components/PageHeader";
import { casinoCities, findCity } from "@/lib/casino";
import { listPosts } from "@/lib/posts";

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = findCity((await params).city);
  if (!city) return {};
  return {
    title: `${city.heading} | ONE AGENCY`,
    description: city.description,
  };
}

export const dynamic = "force-dynamic";

export default async function CityPage({ params }: Props) {
  const city = findCity((await params).city);
  if (!city) notFound();

  const posts = await listPosts(city.slug);

  return (
    <>
      <PageHeader />
      <main className="article-main">
        <nav className="crumbs shell" aria-label="현재 위치">
          <Link href="/casino">카지노</Link> <CaretRight aria-hidden="true" /> <span>{city.name}</span>
        </nav>

        <section className="page-head">
          <div className="shell">
            <h1>{city.heading}</h1>
            <p>{city.description}</p>
          </div>
        </section>

        <section className="shell post-list">
          {posts.length ? (
            posts.map((post) => (
              <Link className="post-card" key={post.id} href={`/casino/${city.slug}/${post.slug}`}>
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
              <p>{city.name} 카지노 안내 글을 준비하고 있습니다.</p>
            </div>
          )}
        </section>

        <section className="city-switch shell" aria-label="다른 도시 보기">
          {casinoCities
            .filter((item) => item.slug !== city.slug)
            .map((item) => (
              <Link key={item.slug} href={`/casino/${item.slug}`}>{item.heading} <ArrowRight /></Link>
            ))}
        </section>
      </main>
      <PageFooter />
    </>
  );
}
