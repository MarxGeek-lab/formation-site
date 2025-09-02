'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import CustomerDetails from '../CustomerDetailsCard';
import { usePropertyStore } from '@/contexts/GlobalContext';
import { getEcommerceData } from '@/app/server/actions';
import { useParams } from 'next/navigation';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from "dayjs/plugin/duration";
import "dayjs/locale/fr";
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import DetailHeader from '../DetailHeader';
import DetailsCard from '../DetailsCard';

dayjs.extend(localizedFormat);
dayjs.extend(duration);

const OrderDetailsPage = () => {
  const params = useParams();
  const { getPaymentsById } = usePropertyStore();
  const [payment, setPayment] = useState(null);
  

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };


  const fetchPayment = async () => {
    if (params && params?.id) {
      try {
        const response = await getPaymentsById(params.id);
        setPayment(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la location :", error);
      }
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [params]);

  if (!payment) {
    return null; // Vous pouvez afficher un loader ici
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <DetailHeader paymentData={payment} order={payment._id} />
      </Grid>
      <Grid container size={{ xs: 12 }}>
        <Grid size={{ xs: 12, md: 8 }} >
          <DetailsCard paymentData={payment} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CustomerDetails paymentData={payment?.customer} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OrderDetailsPage;
