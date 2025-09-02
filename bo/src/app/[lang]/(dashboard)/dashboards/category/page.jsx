'use client';

import { useEffect, useState } from "react";
import ProductCategoryTable from "./components/ProductCategoryTable"
import { useAdminStore, useAuthStore } from "@/contexts/GlobalContext";

const eCommerceProductsCategory = () => {
  const {getAllCategories} = useAdminStore();
  const {user} = useAuthStore();
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    if (user) {
      try {
        const { data } = await getAllCategories();
        setCategories(data)
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [user]);

  return <ProductCategoryTable fetchCategories={fetchCategories} categories={categories} />
}

export default eCommerceProductsCategory
