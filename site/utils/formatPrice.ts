/**
 * Convertit un montant en une devise spécifique et le formate selon la langue.
 * @param amount - Le montant à afficher
 * @param currency - Code de la devise (ex: "EUR", "USD", "XOF")
 * @param locale - Code de la langue (ex: "fr", "en-US")
 * @returns Le prix formaté avec symbole et séparateurs corrects
 */
export function formatPrice(
  amount: number,
  currency: string,
  locale: string
): string {
  return new Intl.NumberFormat('en-US', {
    style: "currency",
    currency,
  }).format(amount);
}
