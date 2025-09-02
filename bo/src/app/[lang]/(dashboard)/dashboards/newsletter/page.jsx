'use client';

import { useEffect, useState } from "react";
import { useAdminStore, useAuthStore, useNewsletterStore } from "@/contexts/GlobalContext";
import ListTable from "./components/ListTable";

const Newsletter = () => {
  const { fetchNewsletterData } = useNewsletterStore();
  const {user} = useAuthStore();
  const [NewsletterMessages, setNewsletterMessage] = useState([]);

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
    fetchNewsletterMessage();
  }, [user]);

  return <ListTable fetchNewsletterMessage={fetchNewsletterMessage} NewsletterMessages={NewsletterMessages} />
}

export default Newsletter
