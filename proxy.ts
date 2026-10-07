import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** www 주소로 들어오면 www 없는 기본 주소로 넘긴다. */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!host.startsWith("www.")) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.host = host.slice(4).split(":")[0];
  url.port = "";
  url.protocol = "https:";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
