import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/rest";
import { isSignedIn } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "사진을 선택해주세요." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "사진 파일만 올릴 수 있습니다." }, { status: 400 });
  }
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "사진 한 장은 15MB까지 올릴 수 있습니다." }, { status: 413 });
  }

  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "업로드에 실패했습니다. 다시 시도해주세요." }, { status: 500 });
  }
}
