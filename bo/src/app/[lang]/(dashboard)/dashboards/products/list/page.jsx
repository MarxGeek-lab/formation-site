'use client';
// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Data Imports
import { usePropertyStore } from '@/contexts/PropertyStore'
import { useAuthStore } from '@/contexts/GlobalContext'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard';
import ProductListTable from './ProductListTable';

const PropertyList = () => {
  // Vars
  const { getPropertiesByUser } = usePropertyStore();
  const { user } = useAuthStore();
  const [ products, setProducts ] = useState([]);
  const [ stats, setStats ] = useState([]);

  const fetchProducts = async () => {
    if (user) {
      try {
        const { data } = await getPropertiesByUser(user?._id);

        const activeCount = data.filter((item) => item.productStatus === 'active').length;
        const inactiveCount = data.filter((item) => item.productStatus === 'inactive').length;
        const draftCount = data.filter((item) => item.productStatus === 'draft').length;
        const availableCount = data.filter((item) => item.state === 'available').length;
        const unavailableCount = data.filter((item) => item.state === 'unavailable').length;

        setStats({ activeCount, inactiveCount, draftCount, availableCount, unavailableCount });

        setProducts(data)
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [user]);

  return (
    <Grid container spacing={6}>
      <Typography variant='h5' className='mb-2'>Liste des produits</Typography>
      <Grid size={{ xs: 12 }}>
        <ProductCard stats={stats} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ProductListTable productData={products} />
      </Grid>
    </Grid>
  )
}

export default PropertyList
