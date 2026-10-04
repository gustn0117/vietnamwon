export const SITE_URL = (process.env.SITE_URL ?? "https://vietnamone.co.kr").replace(/\/$/, "");
export const SITE_NAME = "베트남원 | ONE AGENCY";
export const SITE_DESCRIPTION =
  "나트랑·다낭·하노이·호치민 카지노부터 밤문화, 골프, 호텔까지. 카카오톡과 텔레그램으로 바로 상담하세요.";

export const absolute = (path: string) =>
  encodeURI(`${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);
