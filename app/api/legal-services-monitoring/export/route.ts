import { NextRequest, NextResponse } from "next/server";

// Filters the export accepts; anything else in the query string is dropped.
const EXPORT_PARAMS = ["tab", "q", "lawyer_id", "service_type", "urgency"];

// Streams the monitoring CSV export from the API using the HTTP-only token, so
// the token never has to be exposed to browser JavaScript.
export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return new NextResponse(null, { status: 401 });
  }

  const url = new URL(
    "/api/admin/legal-services-monitoring/export",
    process.env.NEXT_PUBLIC_API_URL,
  );
  for (const name of EXPORT_PARAMS) {
    const value = request.nextUrl.searchParams.get(name);
    if (value) url.searchParams.set(name, value);
  }

  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const locale = request.cookies.get("NEXT_LOCALE")?.value;
  if (locale) headers.set("Accept-Language", locale);

  try {
    const upstream = await fetch(url, { headers, cache: "no-store" });

    // Forward only the status, never the upstream error body.
    if (!upstream.ok || !upstream.body) {
      return new NextResponse(null, { status: upstream.status || 502 });
    }

    const responseHeaders = new Headers({
      "Cache-Control": "private, no-store",
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="legal-services.csv"',
    });
    for (const name of ["content-type", "content-length", "content-disposition"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Legal services monitoring export failed:", error);
    return new NextResponse(null, { status: 502 });
  }
}
