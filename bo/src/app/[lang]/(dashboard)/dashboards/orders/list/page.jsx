'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import OrderCard from './OrderCard'
import OrderListTable from './OrderListTable'
import { useAuthStore, useOrderStore, useStatsStore } from '@/contexts/GlobalContext'
import { useEffect, useState } from 'react'
import HorizontalStatisticsCard from '@/views/apps/ecommerce/referrals/HorizontalStatisticsCard'
import { Typography } from '@mui/material'

const OrderList = () => {
  const { fetchOrders, orders } = useOrderStore();
  const { user } = useAuthStore();
  const { getStatsByOwner } = useStatsStore()
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    if (user) {
      try {
        const { data, status } = await getStatsByOwner();
        if (status === 200) {
          setStats(data)
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
    getOrders();
    fetchStats();
    console.log(stats)
  },[user]);
  
  const data = [
    {
      stats: stats?.countOrders,
      title: 'En Attente',
      avatarIcon: 'tabler-package',
      avatarColor: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' // bleu → violet
    },
    {
      stats: stats?.countOrdersConfirmed,
      title: 'Confirmées',
      avatarIcon: 'tabler-package',
      avatarColor: 'error',
      gradient: 'linear-gradient(135deg, #f85032 0%, #e73827 100%)' // rouge
    },
    {
      stats: stats?.countOrdersDelivered,
      title: 'Livrées',
      avatarIcon: 'tabler-package',
      avatarColor: 'success',
      gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' // vert
    },
    {
      stats: stats?.countOrdersCancelled,
      title: 'Annulées',
      avatarIcon: 'tabler-package',
      avatarColor: 'error',
      gradient: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)' // rouge → rose
    }
  ];
  

  return (
    <Grid container spacing={6}>
      <Typography variant='h5' className='mb-2'>Liste des commandes</Typography>
      <Grid size={{ xs: 12 }}>
        <HorizontalStatisticsCard data={data} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <OrderListTable orderData={orders} showHeader={true} />
      </Grid>
    </Grid>
  )
}

export default OrderList
