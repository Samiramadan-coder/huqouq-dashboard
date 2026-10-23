import { NextRequest, NextResponse } from "next/server";

// Streams a legal service attachment from the API using the HTTP-only token, so
// the token never has to be exposed to browser JavaScript.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return new NextResponse(null, { status: 401 });
  }

  if (!/^\d+$/.test(id)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const upstream = await fetch(
      new URL(`/api/legal-service-files/${id}`, process.env.NEXT_PUBLIC_API_URL),
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    // Forward only the status, never the upstream error body.
    if (!upstream.ok || !upstream.body) {
      return new NextResponse(null, { status: upstream.status || 502 });
    }

    const headers = new Headers({ "Cache-Control": "private, no-store" });
    for (const name of ["content-type", "content-length", "content-disposition"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (error) {
    console.error("Legal service file download failed:", error);
    return new NextResponse(null, { status: 502 });
  }
}
