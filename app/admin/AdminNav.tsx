import Link from "next/link";
import { signOut } from "./actions";

export function AdminNav({ current }: { current: "posts" | "site" | "boards" }) {
  const tabs = [
    { key: "posts", label: "글 관리", href: "/admin" },
    { key: "site", label: "메인 화면", href: "/admin/site" },
    { key: "boards", label: "게시판 관리", href: "/admin/boards" },
  ] as const;

  return (
    <div className="admin-nav">
      <nav>
        {tabs.map((tab) => (
          <Link key={tab.key} href={tab.href} className={tab.key === current ? "is-current" : ""}>
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="admin-nav-side">
        <Link href="/" target="_blank">사이트 보기</Link>
        <form action={signOut}>
          <button type="submit">로그아웃</button>
        </form>
      </div>
    </div>
  );
}
