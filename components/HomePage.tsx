import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Headset,
  LockKey,
  ShieldCheck,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { ContactButtons, FloatingContact } from "@/components/ContactButtons";
import { BoardIcon } from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { boardHref, contactLinks, type SiteData } from "@/lib/site";

function lines(value: string) {
  return value.split("\n").map((line, index, all) => (
    <span key={index}>
      {line}
      {index < all.length - 1 && <br />}
    </span>
  ));
}

const promises = [
  { icon: ShieldCheck, title: "검증된 현지 파트너", copy: "직접 확인한 장소와 서비스만 제안합니다." },
  { icon: Headset, title: "24시간 전담 컨시어지", copy: "낯선 순간에도 한국어로 빠르게 도와드립니다." },
  { icon: LockKey, title: "철저한 프라이버시", copy: "상담부터 현지 일정까지 조용하고 안전하게 진행합니다." },
  { icon: UsersThree, title: "취향 중심 맞춤 설계", copy: "인원과 예산, 원하는 분위기까지 세밀하게 반영합니다." },
];

export function HomePage({ site }: { site: SiteData }) {
  const { settings, boards } = site;
  const contact = contactLinks(settings);

  const cards = [
    {
      key: "casino",
      title: "카지노",
      subtitle: settings.casino_card_subtitle ?? "",
      image: settings.casino_card_image || null,
      icon: "spade",
      position: null as string | null,
      href: "/casino",
    },
    ...boards
      .filter((board) => board.grp === "main" && board.card_show)
      .map((board) => ({
        key: board.slug,
        title: board.name,
        subtitle: board.card_subtitle,
        image: board.card_image,
        icon: board.card_icon,
        position: board.card_position,
        href: boardHref(board),
      })),
  ];

  const features = [
    ...(settings.casino_feature_title
      ? [{
          key: "casino",
          title: settings.casino_feature_title,
          copy: settings.casino_feature_copy ?? "",
          image: settings.casino_feature_image || null,
          href: "/casino",
        }]
      : []),
    ...boards
      .filter((board) => board.feature_title)
      .map((board) => ({
        key: board.slug,
        title: board.feature_title ?? "",
        copy: board.feature_copy ?? "",
        image: board.feature_image,
        href: boardHref(board),
      })),
  ];

  return (
    <>
      <a className="skip-link" href="#main-content">본문 바로가기</a>
      <SiteHeader site={site} />

      <section className="hero" id="top">
        {settings.hero_image && (
          <Image src={settings.hero_image} alt="" fill priority sizes="100vw" className="hero-image" />
        )}
        <div className="hero-shade" />
        <div className="shell hero-inner" id="main-content">
          <h1>{settings.hero_title_1}<br /><em>{settings.hero_title_2}</em></h1>
          {settings.hero_copy && <p className="hero-copy">{settings.hero_copy}</p>}
          <ContactButtons contact={contact} className="contact-buttons hero-buttons" />
          <div className="hero-trust" aria-label="서비스 장점">
            {settings.hero_trust_1 && <span><ShieldCheck /> {settings.hero_trust_1}</span>}
            {settings.hero_trust_2 && <span><LockKey /> {settings.hero_trust_2}</span>}
            {settings.hero_trust_3 && <span><Crown /> {settings.hero_trust_3}</span>}
          </div>
        </div>
        {settings.signature_title && (
          <div className="hero-signature" aria-hidden="true">
            <span>{settings.signature_title}</span>
            <small>{settings.signature_copy}</small>
          </div>
        )}
      </section>

      <section className="service-section" id="services">
        <div className="shell-wide">
          <div className="service-grid">
            {cards.map((card) => (
              <Link className="service-card" key={card.key} href={card.href}>
                {card.image ? (
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(max-width: 760px) 70vw, (max-width: 1080px) 34vw, 20vw"
                    style={{ objectPosition: card.position ?? undefined }}
                  />
                ) : (
                  <span className="hatch" aria-hidden="true"><em>{card.title} 사진 자리</em></span>
                )}
                <span className="service-overlay" />
                <span className="service-copy">
                  <BoardIcon name={card.icon} weight="duotone" />
                  <span>
                    <strong>{card.title}</strong>
                    <small>{card.subtitle}</small>
                  </span>
                </span>
                <span className="service-arrow"><ArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="experience-section" id="experience">
        <div className="shell">
          <div className="experience-heading">
            <h2>{lines(settings.experience_heading ?? "")}</h2>
            <p>{lines(settings.experience_copy ?? "")}</p>
            <Link href="/casino">카지노 안내 보기 <ArrowRight /></Link>
          </div>
          <div className="experience-grid">
            {features.map((feature) => (
              <Link className="experience-card" key={feature.key} href={feature.href}>
                {feature.image ? (
                  <Image src={feature.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
                ) : (
                  <span className="hatch" aria-hidden="true"><em>{feature.title} 사진 자리</em></span>
                )}
                <span className="experience-overlay" />
                <span>
                  <strong>{feature.title}</strong>
                  <small>{feature.copy}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="promise-section">
        <div className="shell promise-grid">
          <div className="promise-intro">
            <h2>{lines(settings.promise_heading ?? "")}</h2>
            <p>{settings.promise_copy}</p>
          </div>
          <div className="promise-list">
            {promises.map(({ icon: Icon, title, copy }) => (
              <article key={title}>
                <Icon weight="duotone" />
                <div><strong>{title}</strong><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="consult-banner" id="consult">
        {settings.banner_image && <Image src={settings.banner_image} alt="" fill sizes="100vw" />}
        <div className="consult-shade" />
        <div className="shell consult-content">
          <div>
            <h2>{lines(settings.banner_heading ?? "")}</h2>
            <p>{settings.banner_copy}</p>
          </div>
          <ContactButtons contact={contact} className="contact-buttons banner-contact" />
        </div>
      </section>

      <SiteFooter site={site} />
      <FloatingContact contact={contact} />
    </>
  );
}
