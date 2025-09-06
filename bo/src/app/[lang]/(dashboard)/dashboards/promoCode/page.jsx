'use client';

import { useEffect, useState } from "react";
import PromoCodeTable from "./components/PromoCodeTable"
import { usePromoCodeStore, useAuthStore } from "@/contexts/GlobalContext";

const PromoCode = () => {
  const { promoCodes, fetchPromoCodes } = usePromoCodeStore();
  const { user } = useAuthStore();

  const handleFetchPromoCodes = async () => {
    if (user) {
      try {
        await fetchPromoCodes();
      } catch (error) {
        console.error("Erreur lors de la récupération des codes promo:", error);
      }
    }
  }

  useEffect(() => {
    handleFetchPromoCodes();
  }, [user]);

  return <PromoCodeTable fetchPromoCodes={handleFetchPromoCodes} promoCodes={promoCodes} />
}

export default PromoCode
