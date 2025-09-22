'use client';
// MUI Imports
import Grid from '@mui/material/Grid2'

// Server Action Imports
import LogisticsStatisticsCard from '@/views/pages/widget-examples/statistics/LogisticsStatisticsCard'
import { useEffect, useState } from 'react'
import { useAuthStore, useOrderStore, useStatsStore } from '@/contexts/GlobalContext'
import { useSearchParams } from 'next/navigation';
import { Typography } from '@mui/material';
import SalesChart from '@/components/SalesChart';
import SalesByCountryChart from '@/components/SalesByCountryChart';
import MostSoldProductsChart from '@/components/MostSoldProductsChart';
import { formatAmount } from '@/utils/formatAmount';

const DashboardCRM = () => {
  // Vars
  // const serverMode = await getServerMode()
  const { user } = useAuthStore();
  const { fetchOrders, orders } = useOrderStore();
  const searchParams = useSearchParams();
  
  const { getStatsByOwner } = useStatsStore();
  const [ statss, setStats ] = useState(null);

  const stats1 = [
    {
      title: 'Total Commandes',
      stats: statss?.countOrders || 0,
      trendNumber: 18.2,
      avatarIcon: 'tabler-shopping-cart',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Total Produits',
      stats: statss?.productsCount || 0,
      trendNumber: -8.7,
      avatarIcon: 'tabler-package',
      gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'
    },
    {
      title: 'Revenues',
      stats: formatAmount(statss?.salesRevenue || 0)+" FCFA" || 0,
      trendNumber: 4.3,
      avatarIcon: 'tabler-wallet',
      gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
    },
    {
      title: 'Total utilisateur',
      stats: statss?.usersCount || 0,
      trendNumber: 2.5,
      avatarIcon: 'tabler-users',
      gradient: 'linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)'
    }
  ]

  const fetchStats = async () => {
    if (user) {
      try {
        const { data, status } = await getStatsByOwner();
        if (data) {
          setStats(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const getOrders = async () => {
    if (user) {
      try {
        await fetchOrders();
      } catch (error) {
        console.log(error);
      }
    }
  }
  useEffect(() => {
    fetchStats();
    getOrders();
  },[user]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem("accessToken", token);
    }
  },[searchParams]);

  console.log("statss == ", statss)

  return (
    <Grid container spacing={6}>
       <Grid size={{ xs: 12 }}>
        <Typography variant="h5" sx={{ mb: 5 }}>
            Statistiques globales
          </Typography>
        <LogisticsStatisticsCard data={stats1} />
      </Grid>
      {/* <Grid size={{ xs: 12, xl: 8 }}>
        <RevenueReport />
      </Grid> */}
      {/* Sales by Country Chart */}
      <Grid size={{ xs: 12 }}>
        <SalesChart />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <SalesByCountryChart />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MostSoldProductsChart />
      </Grid>
    </Grid>
  )
}

export default DashboardCRM
