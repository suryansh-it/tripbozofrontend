// app/country/[country]/page.jsx
import CountryAppsPage from "@/components/countryapp/CountryAppsPage";
import { fetchAppsByCountry, fetchCountryInfo, fetchCountryTravelUpdates } from "@/src/utils/api";
import { notFound } from "next/navigation";

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

  const travelPayload = await fetchCountryTravelUpdates(countryCode);
  const travelUpdates = Array.isArray(travelPayload?.updates) ? travelPayload.updates : [];
  const travelSignal = travelPayload?.signal || {};

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
