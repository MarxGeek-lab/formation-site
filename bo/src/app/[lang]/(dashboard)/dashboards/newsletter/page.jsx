'use client';

import { useEffect, useState } from "react";
import { useAdminStore, useAuthStore, useCustomerStore, useNewsletterStore } from "@/contexts/GlobalContext";
import ListTable from "./components/ListTable";

const Newsletter = () => {
  const { fetchNewsletterData } = useNewsletterStore();
  const {user} = useAuthStore();
  const [NewsletterMessages, setNewsletterMessage] = useState([]);

  const { getCustomersByOwner } = useCustomerStore();
  const [ customers, setCustomers ] = useState([]);

  const fetchCustomers = async () => {
    if (user) {
      try {
        const { data } = await getCustomersByOwner();
        setCustomers(data)
      } catch (error) {
        console.log(error);
      }
    }
  }

  const fetchNewsletterMessage = async () => {
    if (user) {
      try {
        const { data } = await fetchNewsletterData();
        setNewsletterMessage(data)
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchCustomers();
    fetchNewsletterMessage();
  }, [user]);

  return <ListTable fetchNewsletterMessage={fetchNewsletterMessage} NewsletterMessages={NewsletterMessages} customers={customers} />
}

export default Newsletter
