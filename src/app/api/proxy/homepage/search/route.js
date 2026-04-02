const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://tripbozo.onrender.com/api";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("query") || "").trim();
    if (!query) {
      return Response.json({ results: [] }, { status: 200 });
    }

    const upstream = await fetch(
      `${API_BASE_URL}/homepage/search/?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    const text = await upstream.text();
    if (!upstream.ok) {
      return new Response(text || "Upstream error", {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json({ results: [] }, { status: 200 });
  }
}
