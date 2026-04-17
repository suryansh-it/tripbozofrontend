// app/country/[country]/page.jsx
import CountryAppsPage from "@/components/countryapp/CountryAppsPage";
import { fetchAppsByCountry, fetchCountryInfo } from "@/src/utils/api";
import { notFound } from "next/navigation";

const stripXmlText = (value = "") =>
  String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const extractTag = (xml, tag) => {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`, "i"));
  return match ? stripXmlText(match[1]) : "";
};

const escapeRegExp = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const classifyUpdate = (title = "", description = "") => {
  const text = `${title} ${description}`.toLowerCase();
  if (/storm|weather|hurricane|typhoon|cyclone|flood|wildfire|earthquake/i.test(text)) {
    return "Weather / emergency";
  }
  if (/emergency|warning|advisory|security|protest|unrest|disruption/i.test(text)) {
    return "Travel alert";
  }
  if (/festival|holiday|parade|celebration|carnival|event/i.test(text)) {
    return "Festival / crowd";
  }
  return "Travel news";
};

const summarizeImpact = (items) => {
  const text = items.map((item) => `${item.title} ${item.description}`.toLowerCase()).join(" ");
  if (/storm|weather|hurricane|typhoon|cyclone|flood|wildfire|earthquake|emergency|warning|advisory/i.test(text)) {
    return {
      label: "Monitor closely",
      note: "There are travel-impacting alerts in the latest news scan. Check timing before booking or leaving.",
    };
  }
  if (/festival|holiday|parade|celebration|carnival|event/i.test(text)) {
    return {
      label: "Expect crowds",
      note: "Festivals and major events may affect prices, traffic, and hotel availability.",
    };
  }
  return {
    label: "Travel window looks open",
    note: "No major disruption signals surfaced in the latest travel news scan.",
  };
};

async function fetchTravelUpdates(countryName) {
  const query = `"${countryName}" travel tourism weather emergency storm festival advisory`;
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const response = await fetch(rssUrl, {
      cache: "no-store",
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });

    if (!response.ok) return [];

    const xml = await response.text();
    const countryRegex = new RegExp(`\\b${escapeRegExp(countryName)}\\b`, "i");

    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .slice(0, 16)
      .map((match) => {
        const chunk = match[1];
        const title = extractTag(chunk, "title");
        const link = extractTag(chunk, "link");
        const description = extractTag(chunk, "description");
        const pubDate = extractTag(chunk, "pubDate");
        const haystack = `${title} ${description}`;
        let relevance = 0;

        if (countryRegex.test(haystack)) relevance += 4;
        if (countryRegex.test(title)) relevance += 2;
        if (/travel|tourism|tourist|airport|visa|flight|rail|weather|storm|festival|emergency|advisory/i.test(haystack)) {
          relevance += 1;
        }

        return {
          title,
          link,
          description,
          pubDate,
          badge: classifyUpdate(title, description),
          relevance,
        };
      })
      .filter((item) => item.title)
      .sort((a, b) => b.relevance - a.relevance);

    const countryMatched = items.filter((item) => item.relevance >= 4);
    const finalItems = (countryMatched.length ? countryMatched : items)
      .slice(0, 6)
      .map(({ relevance, ...item }) => item);

    return finalItems;
  } catch {
    return [];
  }
}

export default async function CountryPage({ params }) {
    // await the params object first:
    const { country } = await params;  
    const countryCode = country.toUpperCase();

  const [countryInfo, apps] = await Promise.all([
    fetchCountryInfo(countryCode),
    fetchAppsByCountry(countryCode),
  ]);

  if (!countryInfo.name) {
    return notFound();
  }

  const travelUpdates = await fetchTravelUpdates(countryInfo.name);
  const travelSignal = summarizeImpact(travelUpdates);

  return (
    <CountryAppsPage
      countryCode={countryInfo.code}
      countryInfo={countryInfo}
      apps={apps}
      travelUpdates={travelUpdates}
      travelSignal={travelSignal}
    />
  );
}
