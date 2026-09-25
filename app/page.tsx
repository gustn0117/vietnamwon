import { HomePage } from "@/components/HomePage";
import { getSiteData } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <HomePage site={await getSiteData()} />;
}
