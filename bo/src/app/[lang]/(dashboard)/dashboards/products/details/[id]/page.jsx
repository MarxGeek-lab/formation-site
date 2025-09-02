'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import CustomerDetails from '../CustomerDetailsCard';
import { usePropertyStore } from '@/contexts/GlobalContext';
import { useParams } from 'next/navigation';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from "dayjs/plugin/duration";
import "dayjs/locale/fr";
import { Box } from '@mui/material';
import PropertyDetailHeader from '../PropertyDetailHeader';
import PropertyDetailsCard from '../PropertyDetailsCard';

dayjs.extend(localizedFormat);
dayjs.extend(duration);

const OrderDetailsPage = () => {
  const params = useParams();
  const { getPropertyById } = usePropertyStore();
  const [product, setProduct] = useState(null);
  
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

  const fetchProperty = async () => {
    if (params && params?.id) {
      try {
        const response = await getPropertyById(params.id);
        setProduct(response.data);
        console.log("Property data:", response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la location :", error);
      }
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [params]);

  if (!product) {
    return null; // Vous pouvez afficher un loader ici
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PropertyDetailHeader propertyData={product} propertyId={product._id} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <PropertyDetailsCard product={product} />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
          <Slider {...settings}>
            {product.photos.map((img, index) => (
              <Box key={index} sx={{width: '100%'}}>
                    <img src={img} alt={`Slide ${index}`} style={{ 
                  width: '100%', height: '300px', objectFit: 'contain', borderRadius: 2 }}  />
              </Box>
            ))}
          </Slider>
        </Box>
      </Grid>
    </Grid>
  );
};

export default OrderDetailsPage;
