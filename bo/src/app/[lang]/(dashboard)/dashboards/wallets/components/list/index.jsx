// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import InvoiceListTable from './InvoiceListTable'
import { useEffect, useState } from 'react'
import Header from './Header';
import EarningReports from '../EarningReports';

const InvoiceList = ({ paymentsData }) => {
  const [ stats, setStats ] = useState(null);

  const data = [
    {
      title: 'Revenue',
      progress: 64,
      stats: "0 F CFA",
      progressColor: 'primary',
      avatarColor: 'primary',
      avatarIcon: 'tabler-currency-dollar'
    },
    {
      title: 'Disponible au Retrait',
      progress: 59,
      stats: "0 F CFA",
      progressColor: 'info',
      avatarColor: 'info',
      avatarIcon: 'tabler-chart-pie-2'
    },
    /* {
      title: 'Dépense',
      progress: 22,
      stats: '$74.19',
      progressColor: 'error',
      avatarColor: 'error',
      avatarIcon: 'tabler-brand-paypal'
    } */
  ]

  useEffect(() => {
    if (paymentsData) {
      const completed = paymentsData.filter(item => item.status === 'completed');
      const failed = paymentsData.filter(item => item.status === 'failed');
      const pending = paymentsData.filter(item => item.status === 'pending');
      const refunded = paymentsData.filter(item => item.status === 'refunded');

      setStats({
        completed: completed.length || 0,
        failed: failed.length,
        pending: pending.length,
        refunded: refunded.length
      })
    }
  }, [paymentsData]);
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 6 }}>
        <EarningReports earn={data} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Header stats={stats} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <InvoiceListTable paymentsData={paymentsData} />
      </Grid>
    </Grid>
  )
}

export default InvoiceList
