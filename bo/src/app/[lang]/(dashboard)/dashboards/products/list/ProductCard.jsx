'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// Third-party Imports;! :n!nlk
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import HorizontalStatisticsCard from '@/views/apps/ecommerce/referrals/HorizontalStatisticsCard'

const ProductCard = ({ stats }) => {
  // Hooks
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  
  const data = [
    {
      stats: stats?.activeCount,
      title: 'Produits actif',
      avatarIcon: 'tabler-package',
      avatarColor: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' // bleu → violet
    },
    {
      stats: stats?.inactiveCount,
      title: 'Produits inactif',
      avatarIcon: 'tabler-package',
      avatarColor: 'error',
      gradient: 'linear-gradient(135deg, #f85032 0%, #e73827 100%)' // rouge dégradé
    },
    {
      stats: stats?.availableCount,
      title: 'Produits disponible',
      avatarIcon: 'tabler-package',
      avatarColor: 'success',
      gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' // vert dégradé
    },
    {
      stats: stats?.unavailableCount,
      title: 'Produits indisponible',
      avatarIcon: 'tabler-package',
      avatarColor: 'error',
      gradient: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)' // rouge → rose
    }
  ];
  

  return (
    <HorizontalStatisticsCard data={data} />
  )
}

export default ProductCard
