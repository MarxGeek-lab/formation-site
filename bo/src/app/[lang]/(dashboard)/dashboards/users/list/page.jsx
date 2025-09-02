'use client';
// Data Imports
import { useEffect, useState } from 'react';
import { useAdminStore, useAuthStore } from '@/contexts/GlobalContext';
import ListTable from './list/ListTable';
import Grid from '@mui/material/Grid2'
import HeaderTable from './list/Header';

const CustomerListTablePage = () => {
  // Vars

  const { user } = useAuthStore();
  const { getAllUsers } = useAdminStore();
  const [ customers, setCustomers ] = useState([]);
  const [stats, setStats] = useState();
  
  const fetchAdmin = async () => {
    console.log(user)
    if (user) {
      try {
        const { data } = await getAllUsers();
        console.log(data);
        setCustomers(data)

        const submitted = data.filter(item => item.status === 'submitted').length || 0;
        const approved = data.filter(item => item.status === 'approved').length || 0;
        const rejected = data.filter(item => item.status === 'rejected').length || 0;

        setStats({submitted, approved, rejected});
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchAdmin();
  }, [user]);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <HeaderTable stats={stats} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ListTable customerData={customers} />
      </Grid>
    </Grid>
  )
}

export default CustomerListTablePage
