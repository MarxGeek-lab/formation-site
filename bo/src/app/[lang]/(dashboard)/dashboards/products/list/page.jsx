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
  const { getAllProducts, allProducts } = usePropertyStore();
  const { user } = useAuthStore();
  const [ stats, setStats ] = useState([]);

  useEffect(() => {
    getAllProducts();
  }, [user]);

  useEffect(() => {
    const stats = {
      countProducts: allProducts?.length || 0,
      countProductsActive: allProducts?.filter(product => product?.productStatus === 'active')?.length || 0,
      countProductsInactive: allProducts?.filter(product => product?.productStatus === 'inactive')?.length || 0,
      // countProductsDraft: allProducts?.filter(product => product?.productStatus === 'draft')?.length || 0,
    }
    setStats(stats);
  }, [allProducts]);

  return (
    <Grid container spacing={6}>
      <Typography variant='h5' className='mb-1'>Liste des produits</Typography>
      <Grid size={{ xs: 12 }}>
        <ProductCard stats={stats} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ProductListTable productData={allProducts} />
      </Grid>
    </Grid>
  )
}

export default PropertyList
