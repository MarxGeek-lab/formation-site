'use client';
// Data Imports
import { useEffect, useState } from 'react';
import { useAuthStore, useCustomerStore } from '@/contexts/GlobalContext';
import CustomerListTable from './list/CustomerListTable';

const CustomerListTablePage = () => {
  // Vars

  const { user } = useAuthStore();
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
  
    useEffect(() => {
      fetchCustomers();
    }, [user]);

  return <CustomerListTable customerData={customers} />
}

export default CustomerListTablePage
