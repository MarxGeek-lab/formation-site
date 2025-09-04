'use client';
// MUI Imports
import Grid from '@mui/material/Grid2'

// Server Action Imports
import LogisticsStatisticsCard from '@/views/pages/widget-examples/statistics/LogisticsStatisticsCard'
import { useEffect, useState } from 'react'
import { useAuthStore, useOrderStore, useStatsStore } from '@/contexts/GlobalContext'
import { useSearchParams } from 'next/navigation';
import { Typography } from '@mui/material';
import OrderListTable from '../orders/list/OrderListTable';

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
      title: 'Produits en Stock',
      stats: statss?.productsCount || 0,
      trendNumber: -8.7,
      avatarIcon: 'tabler-package',
      gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'
    },
    {
      title: 'Utilisateurs Inscrits',
      stats: statss?.usersCount || 0,
      trendNumber: 4.3,
      avatarIcon: 'tabler-users',
      gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)'
    },
    {
      title: 'Visiteurs',
      stats: statss?.userVisitCount || 0,
      trendNumber: 2.5,
      avatarIcon: 'tabler-eye',
      gradient: 'linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)'
    }
  ]

  const fetchStats = async () => {
    if (user) {
      try {
        const { data, status } = await getStatsByOwner();
        console.log(data)
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

  return (
    <Grid container spacing={6}>
       <Grid size={{ xs: 12 }}>
        <Typography variant="h5" sx={{ mb: 5 }}>
            Statistiques globales
          </Typography>
        <LogisticsStatisticsCard data={stats1} />
      </Grid>
      {/* <Grid size={{ xs: 12 }}>
        <Typography variant="h5" sx={{ mb: 5 }}>
          Statistiques commandes
        </Typography>
        <LogisticsStatisticsCard data={ordersStats} />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <Typography variant="h5" sx={{ mb: 5 }}>
          Dernières Commandes
        </Typography>
        <OrderListTable orderData={orders?.slice(0, 5)} showHeader={false} />
      </Grid>
    </Grid>
  )
}

export default DashboardCRM
