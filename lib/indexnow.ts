import "server-only";

import { SITE_URL } from "@/lib/seo";

const KEY = "2caebaef96eeb87748b6df91a62d728e";
const HOST = new URL(SITE_URL).host;

/** Tell IndexNow (Naver, Bing, Yandex…) that these pages changed. Never throws. */
export async function pingIndexNow(urls: string[]) {
  const urlList = [...new Set(urls.filter(Boolean))];
  if (!urlList.length) return;

  const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE_URL}/${KEY}.txt`, urlList });

  await Promise.allSettled(
    ["https://api.indexnow.org/indexnow", "https://searchadvisor.naver.com/indexnow"].map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
        cache: "no-store",
      }),
    ),
  );
}

export const indexNowKey = KEY;
