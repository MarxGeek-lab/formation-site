import { country } from "@/data/countries";

/**
 * Récupère la localisation du visiteur via ipinfo.io
 */
async function getGeoInfo(): Promise<{ countryCode: string; currency: string; language: string }> {
  try {
    const res = await fetch("https://ipinfo.io/json?token=2bd97a10417331");
    const data = await res.json();

    const countryInfo = country.find((c: any) => c.countryCode === data.country);

    return {
      countryCode: data.country,
      currency: countryInfo?.currencyCode || "USD",
      language: navigator.language.split("-")[0] || "en", // fr ou en
    };
  } catch (error) {
    console.error("Error fetching geo info:", error);
    return { countryCode: "US", currency: "USD", language: "en" };
  }
}

/**
 * Convertit un montant depuis XOF vers une devise cible et le formate
 */
async function convertPrice(amount: number, toCurrency: string, language: string): Promise<string> {
  try {
    const res = await fetch(`https://api.exchangerate.host/convert?from=XOF&to=${toCurrency}&amount=${amount}`);
    const data = await res.json();
console.log(data)
    if (!data.result) throw new Error("Conversion failed");

    return new Intl.NumberFormat(language, {
      style: "currency",
      currency: toCurrency,
    }).format(data.result);
  } catch (error) {
    console.error("Error converting price:", error);
    // fallback : afficher le montant en XOF
    return `${amount} XOF`;
  }
}

/**
 * Utilitaire principal : récupère la localisation et convertit le montant automatiquement
 * @param amount - Montant en XOF
 * @returns Prix converti et formaté selon le pays de l'utilisateur
 */
export async function getLocalizedPrice(amount: number): Promise<string> {
  const geo = await getGeoInfo();
  return convertPrice(amount, geo.currency, geo.language);
}
