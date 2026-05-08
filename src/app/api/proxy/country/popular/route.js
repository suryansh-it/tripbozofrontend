const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://tripbozo.onrender.com/api";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") || "6";
    const upstream = await fetch(`${API_BASE_URL}/country/popular/?limit=${encodeURIComponent(limit)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await upstream.text();
    return new Response(text || "[]", {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json([], { status: 200 });
  }
}