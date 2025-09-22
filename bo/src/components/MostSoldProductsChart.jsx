'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid2'
import { useTheme } from '@mui/material/styles'

// Context Imports
import { useStatsStore } from '@/contexts/GlobalContext'

const MostSoldProductsChart = () => {
  // States
  const [loading, setLoading] = useState(true)
  
  // Hooks
  const theme = useTheme()
  const { mostSoldProducts, getMostSoldProducts } = useStatsStore()

  // Fetch most sold products data
  const fetchMostSoldProducts = async () => {
    try {
      setLoading(true)
      await getMostSoldProducts(100)
    } catch (error) {
      console.error('Erreur lors de la récupération des produits les plus vendus:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMostSoldProducts()
  }, [])

  const getProductImage = (photos) => {
    if (photos && photos.length > 0) {
      return photos[0]
    }
    return '/images/placeholder-product.png'
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Ebooks': 'primary',
      'Formations': 'secondary',
      'Logiciels': 'success',
      'Templates': 'warning',
      'Outils': 'info',
      'default': 'default'
    }
    return colors[category] || colors.default
  }

  return (
    <Card>
      <CardHeader 
        title="Produits les Plus Vendus"
        subheader="Top 10 des produits par quantité vendue"
      />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography>Chargement des données...</Typography>
          </Box>
        ) : mostSoldProducts?.mostSoldProducts?.length > 0 ? (
          <>
            {/* Tableau des produits */}
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell align="center">Catégorie</TableCell>
                    <TableCell align="right">Quantité Vendue</TableCell>
                    <TableCell align="right">Revenus</TableCell>
                    <TableCell align="right">Commandes</TableCell>
                    <TableCell align="right">Performance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mostSoldProducts.mostSoldProducts.map((product, index) => (
                    <TableRow key={product.productId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={getProductImage(product.productImage)}
                            alt={product.productName}
                            sx={{ width: 40, height: 40 }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {product.productName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              #{index + 1}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={product.category || 'Non catégorisé'} 
                          size="small" 
                          color={getCategoryColor(product.category)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium" color="primary">
                          {product.totalQuantitySold}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {product?.totalRevenue?.toLocaleString()} FCFA
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={product.totalOrders} 
                          size="small" 
                          color="secondary" 
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 120 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={product.quantityPercentage}
                            sx={{ 
                              width: 60, 
                              height: 6,
                              borderRadius: 3,
                              bgcolor: 'action.hover'
                            }}
                            color={index < 3 ? 'success' : 'primary'}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {product.quantityPercentage}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Statistiques résumées */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">
                    {mostSoldProducts.totalQuantitySold}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Quantité Vendue
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="h6" color="secondary">
                    {mostSoldProducts.totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Revenus Totaux (FCFA)
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="h6" color="success.main">
                    {mostSoldProducts.topProductsCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Produits Actifs
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="h6" color="warning.main">
                    {mostSoldProducts.totalQuantitySold > 0 ? 
                      Math.round(mostSoldProducts.totalRevenue / mostSoldProducts.totalQuantitySold).toLocaleString() : 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prix Moyen (FCFA)
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Top 3 Produits - Highlight */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                🏆 Top 3 Produits
              </Typography>
              <Grid container spacing={2}>
                {mostSoldProducts.mostSoldProducts.slice(0, 3).map((product, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={product.productId}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        border: 1, 
                        borderColor: index === 0 ? 'warning.main' : index === 1 ? 'info.main' : 'success.main',
                        borderRadius: 2,
                        bgcolor: index === 0 ? 'warning.50' : index === 1 ? 'info.50' : 'success.50',
                        position: 'relative'
                      }}
                    >
                      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <Typography variant="h4" sx={{ opacity: 0.3 }}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Avatar
                          src={getProductImage(product.productImage)}
                          alt={product.productName}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {product.productName}
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary" sx={{ mb: 0.5 }}>
                        {product.totalQuantitySold} vendus
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.totalRevenue.toLocaleString()} FCFA
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography color="text.secondary">Aucune donnée disponible</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default MostSoldProductsChart
