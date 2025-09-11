/**
 * Retourne le prix localisé selon le pays de l'utilisateur
 * @param amount montant en XOF
 * @returns prix formaté en string
 */
export async function getLocalizedPrice(amount: number): Promise<string> {
  try {
    const res = await fetch(`/api/price?amount=${amount}`);
    const data = await res.json();

    if (data?.price) {
      return data.price;
    }

    return amount.toString(); // fallback si API échoue
  } catch (error) {
    console.error("Erreur getLocalizedPrice:", error);
    return amount.toString(); // fallback
  }
}
