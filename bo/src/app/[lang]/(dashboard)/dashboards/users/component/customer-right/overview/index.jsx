'use client';
// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomerStatisticsCard from './CustomerStatisticsCard'
import OrderListTable from './OrderListTable'
import { useAuthStore, useCustomerStore } from '@/contexts/GlobalContext';
import { useEffect, useState } from 'react';

// Data Imports

const Overview = ({ userData, customerId }) => {
  // Vars
  const { getCustomersLocation } = useCustomerStore();
  const { user } = useAuthStore();
  const [locations, setLocation] = useState([]);

  const customerStats = [
    {
      color: 'primary',
      avatarIcon: 'tabler-currency-dollar',
      title: 'Réservations',
      stats: userData?.totalReservations?.toString(),
      // content: ' Credit Left',
      description: 'Réservations effectué'
    },
    {
      color: 'success',
      avatarIcon: 'tabler-gift',
      title: 'Locations',
      stats: userData?.totalRentals?.toString(),
      // chipLabel: 'Platinum member',
      description: 'Locations effectué'
    },
    {
      color: 'warning',
      avatarIcon: 'tabler-shopping-cart',
      title: 'Achats',
      stats: userData?.totalSale?.toString(),
      // content: 'Items in wishlist',
      description: 'Achat effectué sur le site'
    },
    {
      color: 'info',
      avatarIcon: 'tabler-star',
      title: 'Favoris',
      stats: userData?.totalWhishlist?.toString(),
      // content: 'Coupons you win',
      description: 'Propriété ajouté au favoris'
    },
    {
      color: 'info',
      avatarIcon: 'tabler-star',
      title: 'Paiements',
      stats: userData?.totalPayments?.toString(),
      // content: 'Coupons you win',
      description: 'Propriété ajouté au favoris'
    }
  ];

  useEffect(() => {
    console.log("client id === ", userData)
    const fetch = async () => {
      if (customerId, user) {
        try {
          const { data, status } = await getCustomersLocation(customerId, user?._id);
          console.log("=== ", status);
          console.log("======= ", data);
          setLocation(data);
        } catch (error) {
          console.log(error);
        }
      }
    }

    // fetch();
  },[customerId]);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CustomerStatisticsCard customerStatData={customerStats} />
      </Grid>
    {/*   <Grid size={{ xs: 12 }}>
        <OrderListTable orderData={locations} />
      </Grid> */}
    </Grid>
  )
}

export default Overview
