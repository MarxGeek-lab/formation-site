'use client';

import { useEffect, useState } from "react";
import { useAnnoncesStore, useAuthStore } from "@/contexts/GlobalContext";
import ListTable from "./components/ListTable";

const Newsletter = () => {
  const { fetchAnnonces } = useAnnoncesStore();
  const {user} = useAuthStore();
  const [annonces, setAnnonces] = useState([]);

  const fetchAnnonce = async () => {
    if (user) {
      try {
        const { data } = await fetchAnnonces();
        setAnnonces(data)
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchAnnonce();
  }, [user]);

  return <ListTable fetchAnnonces={fetchAnnonce} annonces={annonces} />
}

export default Newsletter
