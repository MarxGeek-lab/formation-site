'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { useWalletStore } from '@/contexts/GlobalContext';
import { useParams } from 'next/navigation';

import DetailHeader from '../DetailHeader';
import DetailsCard from '../DetailsCard';

const OrderDetailsPage = () => {
  const params = useParams();
  const { getWithdrawalById } = useWalletStore();
  const [withdrawal, setWithdrawal] = useState(null);

  const fetchWithdrawal = async () => {
    if (params && params?.id) {
      try {
        const response = await getWithdrawalById(params.id);
        setWithdrawal(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la location :", error);
      }
    }
  };

  useEffect(() => {
    fetchWithdrawal();
  }, [params]);

  if (!withdrawal) {
    return null; // Vous pouvez afficher un loader ici
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <DetailHeader withdrawalData={withdrawal} order={withdrawal._id} />
      </Grid>
      <Grid container size={{ xs: 12 }}>
          <Grid size={{ xs: 12 }} >
            <DetailsCard withdrawalData={withdrawal} />
          </Grid>
      {/*   
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomerDetails withdrawalData={withdrawal?.buyer} />
        </Grid> */}
      </Grid>
    </Grid>
  );
};

export default OrderDetailsPage;
