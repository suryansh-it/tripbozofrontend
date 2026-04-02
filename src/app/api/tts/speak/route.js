const BASE_TRANSLATE = "https://translate.googleapis.com";

function toBaseLang(lang = "en-US") {
  return String(lang).split("-")[0].toLowerCase();
}

async function translateText(text, targetLang) {
  const tl = toBaseLang(targetLang);
  const url = `${BASE_TRANSLATE}/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Translate failed with ${res.status}`);
  }

  const data = await res.json();
  if (!Array.isArray(data?.[0])) return text;
  const translated = data[0].map((part) => part?.[0] || "").join("").trim();
  return translated || text;
}

async function fetchTtsAudio(text, lang) {
  const tl = toBaseLang(lang);
  const url = `${BASE_TRANSLATE}/translate_tts?ie=UTF-8&client=gtx&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "audio/mpeg,*/*" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`TTS failed with ${res.status}`);
  }

  const contentType = res.headers.get("content-type") || "audio/mpeg";
  const arr = await res.arrayBuffer();
  return { arr, contentType, spokenText: text, lang: tl };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const text = String(body?.text || "").trim();
    const targetLang = String(body?.targetLang || "en-US").trim();
    const autoTranslate = Boolean(body?.autoTranslate);

    if (!text) {
      return Response.json({ detail: "Missing text." }, { status: 400 });
    }

    let spokenText = text;
    if (autoTranslate) {
      spokenText = await translateText(text, targetLang);
    }

    const { arr, contentType, lang } = await fetchTtsAudio(spokenText, targetLang);
    return new Response(arr, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
        "X-TTS-Lang": lang,
      },
    });
  } catch (err) {
    return Response.json(
      { detail: "Unable to synthesize speech.", error: err?.message || "unknown" },
      { status: 502 }
    );
  }
}
