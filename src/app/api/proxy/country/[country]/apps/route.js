const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://tripbozo.onrender.com/api";

export async function GET(_request, { params }) {
  try {
    const resolvedParams = await params;
    const cc = (resolvedParams?.country || "").toUpperCase();
    if (!cc) {
      return Response.json([], { status: 200 });
    }

    const upstream = await fetch(`${API_BASE_URL}/country/${cc}/apps/`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      return new Response(text || "[]", {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json([], { status: 200 });
  }
}
