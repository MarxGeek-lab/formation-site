// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import InvoiceListTable from './InvoiceListTable'
import { useEffect, useState } from 'react'
import Header from './Header';
import EarningReports from './EarningReports';
import { useStatsStore } from '@/contexts/statsContext';
import { useAuthStore } from '@/contexts/AuthContext';

const InvoiceList = ({ requestsData, fetchWallet }) => {
  const [ stats, setStats ] = useState(null);
  const [ statsRevenue, setStatsRevenue ] = useState(null);
  const { getBalanceByOwner } = useStatsStore();
  const { user } = useAuthStore();

  const fetchStats = async () => {
    if (user) {
      try {
        const { data } = await getBalanceByOwner(user?._id);
        if (data) {
          setStatsRevenue(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (requestsData) {
      const approved = requestsData.filter(item => item.status === 'approved');
      const rejected = requestsData.filter(item => item.status === 'rejected');
      const pending = requestsData.filter(item => item.status === 'pending');
      const paid = requestsData.filter(item => item.status === 'paid');

      setStats({
        approved: approved.length || 0,
        rejected: rejected.length,
        pending: pending.length,
        paid: paid.length
      })
    }
  }, [requestsData]);
  
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <EarningReports earn={statsRevenue} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Header stats={stats} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <InvoiceListTable statsSold={statsRevenue} requestsData={requestsData} fetchWallet={fetchWallet} />
      </Grid>
    </Grid>
  )
}

export default InvoiceList
