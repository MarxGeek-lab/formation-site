// utils/getLocalizedPrice.ts
export async function getLocalizedPrice(amount: number) {
  if (isNaN(amount)) {
    return { price: "...", amount: 0, currency: "" };
  }

  const res = await fetch(`/api/price?amount=${amount}`);
  if (!res.ok) {
    throw new Error("Erreur API price");
  }

  const data = await res.json();
  console.log("data == ", data)
  return {
    price: data.price as string,      // ex: "12000 XOF"
    amount: data.amount as string,    // ex: "12000"
    currency: data.currency as string // ex: "XOF"
  };
}
