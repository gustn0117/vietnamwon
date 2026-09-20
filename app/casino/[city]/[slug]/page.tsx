import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CaretRight, ChatsCircle } from "@phosphor-icons/react/dist/ssr";
import { PageFooter } from "@/components/PageFooter";
import { PageHeader } from "@/components/PageHeader";
import { findCity } from "@/lib/casino";
import { getPost } from "@/lib/posts";

type Props = { params: Promise<{ city: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, slug } = await params;
  const city = findCity(citySlug);
  if (!city) return {};
  const post = await getPost(city.slug, slug);
  if (!post) return {};
  return {
    title: `${post.title} | ONE AGENCY`,
    description: post.excerpt || city.description,
  };
}

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: Props) {
  const { city: citySlug, slug } = await params;
  const city = findCity(citySlug);
  if (!city) notFound();

  const post = await getPost(city.slug, slug);
  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <PageHeader />
      <main className="article-main">
        <nav className="crumbs shell" aria-label="현재 위치">
          <Link href="/casino">카지노</Link> <CaretRight aria-hidden="true" />{" "}
          <Link href={`/casino/${city.slug}`}>{city.name}</Link> <CaretRight aria-hidden="true" /> <span>{post.title}</span>
        </nav>

        <article className="shell article">
          <h1>{post.title}</h1>
          <p className="article-date">{date}</p>

          {post.cover_url && (
            <div className="article-cover">
              <Image src={post.cover_url} alt="" fill sizes="(max-width: 1080px) 100vw, 1000px" priority />
            </div>
          )}

          <div className="article-body">
            {post.body
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((block, index) => (
                <p key={index}>
                  {block.split("\n").map((line, lineIndex, lines) => (
                    <span key={lineIndex}>
                      {line}
                      {lineIndex < lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
          </div>

          <div className="article-cta">
            <div>
              <h2>{city.name} 일정, 직접 짜드립니다</h2>
              <p>원하는 날짜와 인원을 남겨주시면 전담 컨시어지가 안내해 드립니다.</p>
            </div>
            <Link className="gold-button" href="/#consult"><ChatsCircle weight="fill" /> 1:1 상담하기 <ArrowRight /></Link>
          </div>

          <Link className="article-back" href={`/casino/${city.slug}`}>{city.heading} 글 목록으로</Link>
        </article>
      </main>
      <PageFooter />
    </>
  );
}
