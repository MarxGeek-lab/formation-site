'use client';

import { useEffect, useState } from "react";
import ProductCategoryTable from "./components/ProductCategoryTable"
import { useAdminStore, useAuthStore } from "@/contexts/GlobalContext";

const eCommerceProductsCategory = () => {
  const {getAllAdmin} = useAdminStore();
  const {user} = useAuthStore();
  const [allAdmin, setAllAdmin] = useState([]);

  const fetchAdmin = async () => {
    if (user) {
      try {
        const { data } = await getAllAdmin();
        setAllAdmin(data)
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchAdmin();
  }, [user]);

  return <ProductCategoryTable fetchAdmin={fetchAdmin} allAdmin={allAdmin} />
}

export default eCommerceProductsCategory
