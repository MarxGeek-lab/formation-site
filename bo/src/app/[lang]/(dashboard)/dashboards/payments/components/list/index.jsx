// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import InvoiceListTable from './InvoiceListTable'
import { useEffect, useState } from 'react'
import Header from './Header';
import HorizontalStatisticsCard from '@/views/apps/ecommerce/referrals/HorizontalStatisticsCard';
import { Typography } from '@mui/material';

const InvoiceList = ({ paymentsData }) => {
  const [ stats, setStats ] = useState(null);

  useEffect(() => {
    if (paymentsData) {
      const completed = paymentsData.filter(item => item.status === 'success');
      const failed = paymentsData.filter(item => item.status === 'failed');
      const pending = paymentsData.filter(item => item.status === 'pending');

      setStats({
        completed: completed.length || 0,
        failed: failed.length,
        pending: pending.length
      })
    }
  }, [paymentsData]);

  const data = [
    {
      stats: stats?.completed,
      title: 'Completé',
      avatarIcon: 'tabler-check',
      avatarColor: 'success',
      gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' // vert
    },
    {
      stats: stats?.pending,
      title: 'En attente',
      avatarIcon: 'tabler-clock',
      avatarColor: 'warning',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' // jaune → orange
    },
    {
      stats: stats?.failed,
      title: 'Echoué',
      avatarIcon: 'tabler-x',
      avatarColor: 'error',
      gradient: 'linear-gradient(135deg, #f85032 0%, #e73827 100%)' // rouge
    }
  ];
  
  return (
    <Grid container spacing={6}>
      <Typography variant='h5' className='mb-0'>Liste des paiements</Typography>
      <Grid size={{ xs: 12 }}>
        <HorizontalStatisticsCard data={data} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <InvoiceListTable paymentsData={paymentsData} />
      </Grid>
    </Grid>
  )
}

export default InvoiceList
