'use client';

import { useEffect } from "react";
import ProductCategoryTable from "./components/ProductCategoryTable"
import { useSubscriptionContext } from "@/contexts/GlobalContext";
import { useAuthStore } from "@/contexts/GlobalContext";

const eCommerceProductsCategory = () => {
  const { fetchSubscription, subscriptionPlans } = useSubscriptionContext();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return <ProductCategoryTable fetchSubscription={fetchSubscription} allSubscriptions={subscriptionPlans} />
}

export default eCommerceProductsCategory
