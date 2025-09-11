/**
 * Convertit un montant depuis XOF vers une devise cible et le formate
 * @param amount - Montant en XOF
 * @param toCurrency - Code de la devise cible (ex: "EUR", "USD")
 * @returns Prix formaté dans la devise cible
 */
export async function convertPrice(amount: number, toCurrency: string): Promise<string> {
  try {
    const res = await fetch(`https://api.exchangerate.host/convert?from=XOF&to=${toCurrency}&amount=${amount}`);
    const data = await res.json();

    if (!data.result) throw new Error("Conversion failed");
    console.log(data.result)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: toCurrency
    }).format(data.result);
  } catch (error) {
    console.error("Error converting price:", error);
    // Fallback : afficher montant en XOF
    return `${amount} XOF`;
  }
}
