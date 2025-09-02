"use client";

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports

// Data Imports
import { useEffect, useState } from 'react';
import InvoiceList from './list'
import { useAuthStore, useWalletStore } from '@/contexts/GlobalContext'

const InvoiceApp = () => {
  // Vars

  const { fetchWallet } = useWalletStore();
  const { user } = useAuthStore();
  const [ requests, setRequests ] = useState([]);

  const fetchWalletsByOwner = async () => {
    if (user) {
      try {
        const { data } = await fetchWallet(user?._id);
        setRequests(data)
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchWalletsByOwner();
  }, [user]); 
    
  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <InvoiceList requestsData={requests} fetchWallet={fetchWalletsByOwner} />
      </Grid>
    </Grid>
  )
}

export default InvoiceApp
