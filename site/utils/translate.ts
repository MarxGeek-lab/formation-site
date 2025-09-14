// utils/translate.ts

// Cache simple en mémoire (clé = texte+langue)
const translationCache = new Map<string, string>();

export async function translate(text: string, targetLang: string): Promise<string> {
  const key = `${text}-${targetLang}`;

  // Vérifie si déjà traduit
  if (translationCache.has(key)) {
    return translationCache.get(key)!;
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang }),
    });

    if (!res.ok) {
      throw new Error("Erreur lors de la traduction");
    }

    console.log(res)

    const data = await res.json();
    const translated = data.translations[0].text;

    // Stocke dans le cache
    translationCache.set(key, translated);

    return translated;
  } catch (error) {
    console.error("Erreur translate util:", error);
    return text; // fallback → retourne le texte original
  }
}
