'use client';
// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Component Imports

// Data Imports
import TotalReviews from './manage-reviews/TotalReviews'
import ReviewsStatistics from './manage-reviews/ReviewsStatistics'
import ManageReviewsTable from './manage-reviews/ManageReviewsTable'
import { useAuthStore, useReviewStore } from '@/contexts/GlobalContext'
import { useEffect, useState } from 'react'

const eCommerceManageReviews = () => {
  // Vars
  const { user } = useAuthStore();
  const { getProductReviews } = useReviewStore();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchReview = async() => {
    if (user) {
      try {
        const { data, status } = await getProductReviews();  
        setReviews(data);
        
        // Calcul du total des avis
        const totalReviews = data.length;
    
        // Calcul du rating total et du nombre d'avis par étoile
        const ratingStats = {
          totalRating: 0,
          starsCount: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
    
        data.forEach(review => {
          const rating = review.rating;
          ratingStats.totalRating += rating;
          ratingStats.starsCount[rating] += 1;
        });
    
        // Calcul du rating moyen (évite division par 0)
        const averageRating = totalReviews > 0 ? (ratingStats.totalRating / totalReviews).toFixed(2) : 0;
        
        setStats({...ratingStats, averageRating, totalReview: data.length });
      } catch (error) {
        console.log(error);
      }
    }    
  }

  useEffect(() => {
    fetchReview();
  },[user]);

  return (
    <Grid container spacing={6}>
      <Typography variant='h5' className='mb-0'>Liste des avis</Typography>
      <Grid size={{ xs: 12 }}>
        <TotalReviews stats={stats} />
      </Grid>
     {/*  <Grid size={{ xs: 12, md: 6 }}>
        <ReviewsStatistics />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <ManageReviewsTable reviewsData={reviews} />
      </Grid>
    </Grid>
  )
}

export default eCommerceManageReviews
