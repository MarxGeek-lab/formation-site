import { country } from "@/data/countries";
import { NextResponse } from "next/server";

const GEO_API_KEY = "16e677da8e1266894489896c6583a4b6"; // clé ipapi
const EXCHANGE_API_KEY = "jwmX3rXnO2NUjayqCBPhGqMj0kkkqSe3"; // clé exchangeratesdata

export async function GET(req: Request) {
  const url = new URL(req.url);
  const amountParam = url.searchParams.get("amount");
  const amount = amountParam ? parseFloat(amountParam) : 0;

  try {
    // 1️⃣ Détection IP et localisation
    console.log("🔍 Étape 1: Détection pays via ipapi");
    const ipRes = await fetch(
      `http://api.ipapi.com/api/check?access_key=${GEO_API_KEY}`
    );
    const ipData = await ipRes.json();
    console.log("📌 ipData == ", ipData);

    const userCountry = ipData.country_name;
    const userCurrency =
      country.find((c: any) => c.countryName === userCountry)?.currencyCode ||
      "XOF"; // ex: "XOF", "EUR", "USD"

    console.log("🌍 Pays détecté:", userCountry, "| Devise:", userCurrency);

    // ⚡ Si la devise est XOF, pas besoin de conversion
    if (userCurrency === "XOF") {
      const formattedPrice = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
      }).format(amount);

      console.log("✅ Montant final (XOF direct):", formattedPrice);

      return NextResponse.json({
        price: formattedPrice,
        currency: "XOF",
        country: userCountry,
        success: true,
      });
    }

    // 2️⃣ Conversion XOF -> Devise détectée
    console.log("🔄 Étape 2: Conversion de XOF vers", userCurrency);
    const exchangeRes = await fetch(
      `https://api.apilayer.com/exchangerates_data/convert?from=XOF&to=${userCurrency}&amount=${amount}`,
      { headers: { apikey: EXCHANGE_API_KEY } }
    );
    const exchangeData = await exchangeRes.json();
    console.log("💱 exchangeData == ", exchangeData);

    if (!exchangeData.result) {
      throw new Error("Conversion échouée");
    }

    // 3️⃣ Formater le prix
    const formattedPrice = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: userCurrency,
    }).format(exchangeData.result);

    console.log("✅ Montant final:", formattedPrice);

    return NextResponse.json({
      price: formattedPrice,
      currency: userCurrency,
      country: userCountry,
      success: true,
    });
  } catch (error) {
    console.error("❌ Erreur dans /api/price:", error);

    return NextResponse.json({
      price: amount + " XOF",
      currency: "XOF",
      country: "Unknown",
      success: false,
      error: String(error),
    });
  }
}


// // /app/api/price/route.ts
// import { NextResponse } from "next/server";

// const GEO_API_KEY = "16e677da8e1266894489896c6583a4b6"; // clé ipapi
// const EXCHANGE_API_KEY = "jwmX3rXnO2NUjayqCBPhGqMj0kkkqSe3"; // clé exchangeratesdata

// // Caches en mémoire
// const ipCache = new Map<string, { country: string; currency: string; ts: number }>();
// const rateCache = new Map<string, { rate: number; ts: number }>();

// const IP_TTL = 24 * 60 * 60 * 1000; // 24h
// const RATE_TTL = 10 * 60 * 1000; // 10 minutes

// function now() {
//   return Date.now();
// }

// function getClientIp(req: Request) {
//   // Essaye x-forwarded-for sinon fallback 'unknown'
//   const forwarded = req.headers.get("x-forwarded-for") || "";
//   const ip = forwarded.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
//   return ip;
// }

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const amountParam = url.searchParams.get("amount");
//   const amount = amountParam ? parseFloat(amountParam) : 0;
//   const clientCurrencyParam = url.searchParams.get("cachedCurrency") || null;
//   const clientCountryParam = url.searchParams.get("cachedCountry") || null;

//   const ip = getClientIp(req);
//   console.log("➡️ /api/price called - amount:", amount, "clientIp:", ip, "clientCurrencyParam:", clientCurrencyParam, "clientCountryParam:", clientCountryParam);

//   try {
//     // 0) Si amount 0, renvoyer vite
//     if (!amount || isNaN(amount)) {
//       console.log("ℹ️ amount invalide ou = 0 -> renvoi 0 XOF");
//       return NextResponse.json({
//         price: "0 XOF",
//         currency: "XOF",
//         country: "Unknown",
//         success: true,
//         source: "invalid_amount",
//       });
//     }

//     // Helper: format XOF
//     const format = (value: number, currency: string) =>
//       new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(value);

//     // 1) Si client envoie cachedCurrency, essaye d'utiliser rateCache (pas d'appel à ip geo)
//     if (clientCurrencyParam) {
//       const toCurrency = clientCurrencyParam.toUpperCase();
//       console.log("🔎 Client fourni une devise en cache:", toCurrency);

//       if (toCurrency === "XOF") {
//         const formatted = format(amount, "XOF");
//         console.log("✅ Devise client = XOF -> renvoi direct:", formatted);
//         // Met à jour ipCache côté serveur (si on connait country param)
//         if (clientCountryParam) {
//           ipCache.set(ip, { country: clientCountryParam, currency: toCurrency, ts: now() });
//         }
//         return NextResponse.json({ price: formatted, currency: "XOF", country: clientCountryParam || "Unknown", success: true, source: "client_cache_xof" });
//       }

//       // Check rate cache
//       const rCache = rateCache.get(toCurrency);
//       if (rCache && now() - rCache.ts < RATE_TTL) {
//         console.log("📥 rateCache HIT for", toCurrency, "rate:", rCache.rate);
//         const converted = amount * rCache.rate;
//         const formatted = format(converted, toCurrency);
//         // update ipCache
//         if (clientCountryParam) ipCache.set(ip, { country: clientCountryParam, currency: toCurrency, ts: now() });
//         return NextResponse.json({ price: formatted, currency: toCurrency, country: clientCountryParam || "Unknown", success: true, source: "rate_cache" });
//       }

//       // Si pas de rateCache, on va récupérer le taux via Apilayer (convert with amount=1 -> rate)
//       console.log("🔁 rateCache MISS -> appeler apilayer pour taux", toCurrency);
//       const exchangeRes = await fetch(
//         `https://api.apilayer.com/exchangerates_data/convert?from=XOF&to=${toCurrency}&amount=1`,
//         { headers: { apikey: EXCHANGE_API_KEY } }
//       );
//       const exchangeData = await exchangeRes.json();
//       console.log("📊 apilayer convert response:", exchangeData);

//       if (!exchangeData || typeof exchangeData.result !== "number") {
//         throw new Error("Conversion failed (apilayer)");
//       }
//       const rate = exchangeData.result; // résultat pour amount=1
//       rateCache.set(toCurrency, { rate, ts: now() });
//       const converted = amount * rate;
//       const formatted = format(converted, toCurrency);
//       if (clientCountryParam) ipCache.set(ip, { country: clientCountryParam, currency: toCurrency, ts: now() });

//       return NextResponse.json({ price: formatted, currency: toCurrency, country: clientCountryParam || "Unknown", success: true, source: "apilayer_convert" });
//     }

//     // 2) Pas de cachedCurrency du client -> vérifier ipCache côté serveur
//     const cachedIp = ipCache.get(ip);
//     if (cachedIp && now() - cachedIp.ts < IP_TTL) {
//       console.log("📥 ipCache HIT:", cachedIp);
//       const toCurrency = cachedIp.currency;
//       if (toCurrency === "XOF") {
//         const formatted = format(amount, "XOF");
//         return NextResponse.json({ price: formatted, currency: "XOF", country: cachedIp.country, success: true, source: "ip_cache_xof" });
//       }

//       const rCache = rateCache.get(toCurrency);
//       if (rCache && now() - rCache.ts < RATE_TTL) {
//         console.log("📥 rateCache HIT for", toCurrency);
//         const converted = amount * rCache.rate;
//         const formatted = format(converted, toCurrency);
//         return NextResponse.json({ price: formatted, currency: toCurrency, country: cachedIp.country, success: true, source: "ip_rate_cache" });
//       }

//       console.log("🔁 Need rate for currency from ipCache -> fetch apilayer");
//       const exchangeRes = await fetch(
//         `https://api.apilayer.com/exchangerates_data/convert?from=XOF&to=${toCurrency}&amount=1`,
//         { headers: { apikey: EXCHANGE_API_KEY } }
//       );
//       const exchangeData = await exchangeRes.json();
//       console.log("📊 apilayer convert response:", exchangeData);
//       if (!exchangeData || typeof exchangeData.result !== "number") {
//         throw new Error("Conversion failed (apilayer)");
//       }
//       const rate = exchangeData.result;
//       rateCache.set(toCurrency, { rate, ts: now() });
//       const converted = amount * rate;
//       const formatted = format(converted, toCurrency);
//       return NextResponse.json({ price: formatted, currency: toCurrency, country: cachedIp.country, success: true, source: "ip_apilayer_convert" });
//     }

//     // 3) Pas de cache serveur pour IP -> détecter via Apilayer IP service
//     console.log("🔍 ipCache MISS -> appel apilayer ip_to_location");
//     const ipRes = await fetch(`https://api.apilayer.com/ip_to_location?ip=check`, {
//       headers: { apikey: GEO_API_KEY },
//     });
//     const ipData = await ipRes.json();
//     console.log("📌 ip_to_location data:", ipData);

//     const detectedCountry = ipData.country_name || ipData.country || "Unknown";
//     const detectedCurrency = (ipData.currency && ipData.currency.code) ? ipData.currency.code : "XOF";
//     console.log("🌍 detectedCountry:", detectedCountry, "detectedCurrency:", detectedCurrency);

//     // Sauvegarde ipCache
//     ipCache.set(ip, { country: detectedCountry, currency: detectedCurrency, ts: now() });

//     if (detectedCurrency === "XOF") {
//       const formatted = format(amount, "XOF");
//       console.log("✅ detected currency XOF -> formatted:", formatted);
//       return NextResponse.json({ price: formatted, currency: "XOF", country: detectedCountry, success: true, source: "ip_detect_xof" });
//     }

//     // Récupère rate (vérifie rateCache en dernier)
//     const existingRate = rateCache.get(detectedCurrency);
//     if (existingRate && now() - existingRate.ts < RATE_TTL) {
//       console.log("📥 rateCache HIT after ip detect:", detectedCurrency, existingRate.rate);
//       const converted = amount * existingRate.rate;
//       const formatted = format(converted, detectedCurrency);
//       return NextResponse.json({ price: formatted, currency: detectedCurrency, country: detectedCountry, success: true, source: "ip_detect_rate_cache" });
//     }

//     console.log("🔁 appeler apilayer pour convertir (ip detected currency)");
//     const exchangeRes2 = await fetch(
//       `https://api.apilayer.com/exchangerates_data/convert?from=XOF&to=${detectedCurrency}&amount=1`,
//       { headers: { apikey: EXCHANGE_API_KEY } }
//     );
//     const exchangeData2 = await exchangeRes2.json();
//     console.log("📊 apilayer convert response 2:", exchangeData2);

//     if (!exchangeData2 || typeof exchangeData2.result !== "number") {
//       throw new Error("Conversion failed (apilayer 2)");
//     }
//     const rate2 = exchangeData2.result;
//     rateCache.set(detectedCurrency, { rate: rate2, ts: now() });
//     const converted2 = amount * rate2;
//     const formatted2 = format(converted2, detectedCurrency);
//     console.log("✅ final formatted:", formatted2);
//     return NextResponse.json({ price: formatted2, currency: detectedCurrency, country: detectedCountry, success: true, source: "ip_detect_apilayer" });
//   } catch (error) {
//     console.error("❌ Error in /api/price:", error);
//     return NextResponse.json({ price: `${amount} XOF`, currency: "XOF", country: "Unknown", success: false, error: String(error) });
//   }
// }
