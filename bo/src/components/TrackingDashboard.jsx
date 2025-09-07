'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Grid from '@mui/material/Grid2'
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
import LinearProgress from '@mui/material/LinearProgress'
import { useTheme } from '@mui/material/styles'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// API Imports
import api from '@/configs/api'

const TrackingDashboard = () => {
  // States
  const [period, setPeriod] = useState('7d')
  const [trackingData, setTrackingData] = useState({
    eventStats: {
      views: 0,
      addToCarts: 0,
      purchases: 0,
      totalRevenue: 0
    },
    conversionFunnel: {
      views: 0,
      addToCarts: 0,
      purchases: 0,
      totalRevenue: 0,
      cartConversionRate: 0,
      purchaseConversionRate: 0,
      checkoutConversionRate: 0
    },
    topProducts: []
  })
  const [loading, setLoading] = useState(true)

  // Hooks
  const theme = useTheme()

  // Fetch tracking data
  const fetchTrackingData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/tracking/admin/stats', {
        params: { period }
      })
      setTrackingData(response.data.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données de tracking:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrackingData()
  }, [period])

  // Chart options for funnel
  const funnelChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['var(--mui-palette-primary-main)', 'var(--mui-palette-warning-main)', 'var(--mui-palette-success-main)'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '70%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toLocaleString()}`
    },
    xaxis: {
      categories: ['Vues Produit', 'Ajouts Panier', 'Achats'],
      labels: {
        style: {
          colors: '#666',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#666',
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    grid: {
      borderColor: '#ccc'
    },
    legend: { show: false }
  }

  const funnelSeries = [{
    name: 'Événements',
    data: [
      trackingData.conversionFunnel.views,
      trackingData.conversionFunnel.addToCarts,
      trackingData.conversionFunnel.purchases
    ]
  }]

  const getPeriodLabel = () => {
    switch (period) {
      case '1d': return 'Dernières 24h'
      case '7d': return '7 derniers jours'
      case '30d': return '30 derniers jours'
      default: return 'Période'
    }
  }

  return (
    <Card>
      <CardHeader 
        title="Dashboard de Tracking"
        subheader={getPeriodLabel()}
      />
      <CardContent>
        {/* Filtres de période */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Période d'analyse
            </Typography>
            <ButtonGroup variant="outlined" size="small">
              <Button
                variant={period === '1d' ? 'contained' : 'outlined'}
                onClick={() => setPeriod('1d')}
              >
                24h
              </Button>
              <Button
                variant={period === '7d' ? 'contained' : 'outlined'}
                onClick={() => setPeriod('7d')}
              >
                7 jours
              </Button>
              <Button
                variant={period === '30d' ? 'contained' : 'outlined'}
                onClick={() => setPeriod('30d')}
              >
                30 jours
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <Typography>Chargement des données...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Statistiques principales */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Statistiques Principales
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="h5" color="primary">
                      {trackingData.eventStats.views.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Vues Produit
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="h5" color="warning.main">
                      {trackingData.eventStats.addToCarts.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ajouts Panier
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="h5" color="success.main">
                      {trackingData.eventStats.purchases.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Achats
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Typography variant="h5" color="info.main">
                      {trackingData.eventStats.totalRevenue.toLocaleString()} FCFA
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Revenus
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Taux de conversion */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader title="Taux de Conversion" />
                <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Vue → Panier</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {trackingData.conversionFunnel.cartConversionRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={trackingData.conversionFunnel.cartConversionRate} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Vue → Achat</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {trackingData.conversionFunnel.purchaseConversionRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={trackingData.conversionFunnel.purchaseConversionRate} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Panier → Achat</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {trackingData.conversionFunnel.checkoutConversionRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={trackingData.conversionFunnel.checkoutConversionRate} 
                    color="warning"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Graphique entonnoir */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Entonnoir de Conversion
              </Typography>
              <AppReactApexCharts
                type='bar'
                height={300}
                width='100%'
                series={funnelSeries}
                options={funnelChartOptions}
              />
            </Grid>

            {/* Top produits */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Produits les Plus Vus
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produit</TableCell>
                      <TableCell align="right">Vues</TableCell>
                      <TableCell align="right">Prix</TableCell>
                      <TableCell align="right">Revenus Potentiels</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trackingData.topProducts.map((product, index) => (
                      <TableRow key={product.productId}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={index + 1} 
                              size="small" 
                              color={index < 3 ? 'primary' : 'default'}
                              sx={{ minWidth: 32 }}
                            />
                            <Typography variant="body2">
                              {product.productName || 'Produit inconnu'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {product.count.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {product.productPrice?.toLocaleString() || 0} FCFA
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            color="success.main"
                            fontWeight="medium"
                          >
                            {((product.productPrice || 0) * product.count).toLocaleString()} FCFA
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {trackingData.topProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography color="text.secondary">
                            Aucune donnée disponible
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default TrackingDashboard
