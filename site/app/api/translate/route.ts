import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    // appel direct vers DeepL (clé jamais exposée côté client)
    const res = await fetch("https://api.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text,
        target_lang: targetLang.toUpperCase(),
      }),
    });

    if (!res.ok) {
      throw new Error(`DeepL error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Erreur API translate:", err);
    return NextResponse.json(
      { error: "Erreur de traduction" },
      { status: 500 }
    );
  }
}
