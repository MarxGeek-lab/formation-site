'use client';
// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomerStatisticsCard from './CustomerStatisticsCard'
import OrderListTable from './OrderListTable'
import { useAuthStore, useCustomerStore } from '@/contexts/GlobalContext';
import { useEffect, useState } from 'react';

// Data Imports

const Overview = ({ orders }) => {
  // Vars
  const { getCustomersLocation } = useCustomerStore();
  const { user } = useAuthStore();
  const [locations, setLocation] = useState([]);
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <OrderListTable orderData={orders} />
      </Grid>
    </Grid>
  )
}

export default Overview
