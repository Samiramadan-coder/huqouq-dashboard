import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const nextParam = request.nextUrl.searchParams.get("next");
  const nextPath = nextParam?.startsWith("/") ? nextParam : "/login";

  const response = NextResponse.redirect(new URL(nextPath, request.url));

  response.cookies.delete("token");

  return response;
}
