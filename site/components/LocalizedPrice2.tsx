"use client";
import { useEffect, useState } from "react";

export default function LocalizedPrice({ amount }: { amount: number }) {
  const [price, setPrice] = useState<string>("...");

  useEffect(() => {
    if (isNaN(amount)) {
      return;
    }
    fetch(`/api/price?amount=${amount}`)
      .then(res => res.json())
      .then(data => setPrice(data.price));
  }, [amount]);

  return <span>{price}</span>;
}
