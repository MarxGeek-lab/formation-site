import { country } from "@/data/countries";
import { NextResponse } from "next/server";

const EXCHANGE_API_KEY = "ab80b34ceeb170f759427601"; // ta clé

export async function GET(req: Request) {
  const url = new URL(req.url);
  const amountParam = url.searchParams.get("amount");
  const amount = amountParam ? parseFloat(amountParam) : 0;

  try {
    // 1️⃣ Récupère la localisation de l'utilisateur via ipinfo.io
    const ipRes = await fetch("https://ipinfo.io/json?token=2bd97a10417331");
    const ipData = await ipRes.json();
    const userCountryCode = ipData.country;

    // 2️⃣ Cherche la devise correspondante dans le tableau
    const countryInfo = country.find((c: any) => c.countryCode === userCountryCode);
    const currency = countryInfo?.currencyCode || "USD";

    // 3️⃣ Récupère les taux de change depuis ExchangeRate-API
    const exchangeRes = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/XOF`
    );
    const exchangeData = await exchangeRes.json();

    if (exchangeData.result !== "success") {
      throw new Error("Conversion failed");
    }

    console.log("exchangeData == ", exchangeData)
    const rate = exchangeData.conversion_rates[currency];
    const convertedAmount = rate ? amount * rate : amount;

    // 4️⃣ Formate le prix
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(convertedAmount);

    return NextResponse.json({
      price: formattedPrice,
      currency,
      country: userCountryCode,
      success: true,
    });
  } catch (error) {
    console.error("Error in /api/price:", error);

    // fallback
    const formattedFallback = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "XOF",
    }).format(amount);

    return NextResponse.json({
      price: formattedFallback,
      currency: "XOF",
      country: "Unknown",
      success: false,
      error: String(error),
    });
  }
}
