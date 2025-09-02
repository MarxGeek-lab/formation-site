'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import OrderDetailHeader from '../OrderDetailHeader';
import OrderDetailsCard from '../OrderDetailsCard';
import CustomerDetails from '../CustomerDetailsCard';
import { usePropertyStore, useReviewStore } from '@/contexts/GlobalContext';
import { getEcommerceData } from '@/app/server/actions';
import { useParams } from 'next/navigation';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from "dayjs/plugin/duration";
import "dayjs/locale/fr";
import { Box } from '@mui/material';

dayjs.extend(localizedFormat);
dayjs.extend(duration);

const OrderDetailsPage = () => {
  const params = useParams();
  const { getReviewById } = useReviewStore();
  const [review, setReview] = useState(null);
  
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


  const fetchReview = async () => {
    if (params && params?.id) {
      try {
        const response = await getReviewById(params.id);
        // const response = await api.get(`reviews/${params.id}`);
        setReview(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la location :", error);
      }
    }
  };

  useEffect(() => {
    fetchReview();
  }, [params]);

  if (!review) {
    return null; // Vous pouvez afficher un loader ici
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <OrderDetailHeader orderData={review} order={review._id} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <OrderDetailsCard review={review} />
          </Grid>
          <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
            <Slider {...settings}>
              {review?.product?.photos.map((img, index) => (
                <Box key={index} component="img" src={img} alt={`Slide ${index}`} sx={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 2 }} />
              ))}
            </Slider>
          </Box>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <CustomerDetails rentalData={review?.user} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default OrderDetailsPage;
