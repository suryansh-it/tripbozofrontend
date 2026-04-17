const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://tripbozo.onrender.com/api";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const cc = (resolvedParams?.country || "").toUpperCase();
    const url = new URL(request.url);
    const origin = (url.searchParams.get("origin_country") || "").toUpperCase();
    const query = origin ? `?origin_country=${encodeURIComponent(origin)}` : "";
    if (!cc) {
      return Response.json(
        { detail: "Missing country code." },
        { status: 400 }
      );
    }

    const upstream = await fetch(`${API_BASE_URL}/country/${cc}/essentials/${query}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

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
  } catch (_err) {
    return Response.json(
      { emergencies: [], phrases: [], tips: [] },
      { status: 200 }
    );
  }
}
