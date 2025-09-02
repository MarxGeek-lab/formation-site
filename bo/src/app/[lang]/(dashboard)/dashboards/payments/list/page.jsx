"use client";

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports

// Data Imports
import { useEffect, useState } from 'react';
import InvoiceList from '../components/list'
import { useAuthStore, usePropertyStore } from '@/contexts/GlobalContext'

const InvoiceApp = () => {
  // Vars

  const { getPaymentsBySeller } = usePropertyStore();
  const { user } = useAuthStore();
  const [ payments, setPayments ] = useState([]);
  const [ stats, setStats ] = useState([]);

  const fetchPayments = async () => {
    if (user) {
      try {
        const { data } = await getPaymentsBySeller();

        const soldCount = data.filter((item) => item.state === 'sold').length;
        const rentCount = data.filter((item) => item.state === 'rent').length;
        const availableCount = data.filter((item) => item.state === 'available').length;
        const reservedCount = data.filter((item) => item.state === 'reserved').length;
        const isValidateCount = data.filter((item) => item.statusValidate === 'aproved').length;
        const rejectedCount = data.filter((item) => item.statusValidate === 'rejected').length;

        setStats({ soldCount, rentCount, availableCount, reservedCount, isValidateCount, rejectedCount });

        setPayments(data)
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchPayments();
  }, [user]); 
    
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <InvoiceList paymentsData={payments} />
      </Grid>
    </Grid>
  )
}

export default InvoiceApp
