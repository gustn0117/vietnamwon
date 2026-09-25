import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isSignedIn } from "@/lib/session";
import { getSettings } from "@/lib/site";
import { AdminNav } from "../AdminNav";
import { SiteForm } from "../SiteForm";

export const metadata: Metadata = {
  title: "메인 화면 관리 | ONE AGENCY",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  if (!(await isSignedIn())) redirect("/admin");

  return (
    <main className="admin-main">
      <div className="admin-shell">
        <AdminNav current="site" />
        <header className="admin-head">
          <h1>메인 화면 관리</h1>
        </header>
        <SiteForm settings={await getSettings()} />
      </div>
    </main>
  );
}
