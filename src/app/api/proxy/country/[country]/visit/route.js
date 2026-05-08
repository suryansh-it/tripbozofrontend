const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://tripbozo.onrender.com/api";

export async function POST(_request, { params }) {
  try {
    const resolvedParams = await params;
    const cc = (resolvedParams?.country || "").toUpperCase();
    if (!cc) {
      return Response.json({ detail: "Missing country code." }, { status: 400 });
    }

    const upstream = await fetch(`${API_BASE_URL}/country/${cc}/visit/`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    const text = await upstream.text();
    return new Response(text || "{}", {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json({ ok: true }, { status: 200 });
  }
}