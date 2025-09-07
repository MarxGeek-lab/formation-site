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
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fr } from 'date-fns/locale'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// API Imports
import api from '@/configs/api'

const SalesChart = () => {
  // States
  const [period, setPeriod] = useState('year')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [salesData, setSalesData] = useState({
    labels: [],
    salesData: [],
    ordersData: [],
    totalRevenue: 0,
    totalOrders: 0
  })
  const [loading, setLoading] = useState(true)

  // Hooks
  const theme = useTheme()

  // Fetch sales data
  const fetchSalesData = async () => {
    try {
      setLoading(true)
      const params = {
        period,
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        date: selectedDate.toISOString().split('T')[0]
      }
      
      const response = await api.get('/stats/sales', { params })
      setSalesData(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données de vente:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalesData()
  }, [period, selectedDate])

  // Chart options
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['var(--mui-palette-primary-main)', 'var(--mui-palette-secondary-main)'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: [3, 3]
    },
    grid: {
      borderColor: 'var(--mui-palette-divider)',
      strokeDashArray: 5,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 0, bottom: 0, left: 0 }
    },
    xaxis: {
      categories: salesData.labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: 'var(--mui-palette-text-disabled)',
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Revenus (FCFA)',
          style: {
            color: 'var(--mui-palette-text-secondary)',
            fontFamily: theme.typography.fontFamily
          }
        },
        labels: {
          style: {
            colors: 'var(--mui-palette-text-disabled)',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize
          },
          formatter: (value) => `${value.toLocaleString()} FCFA`
        }
      },
      {
        opposite: true,
        title: {
          text: 'Nombre de commandes',
          style: {
            color: 'var(--mui-palette-text-secondary)',
            fontFamily: theme.typography.fontFamily
          }
        },
        labels: {
          style: {
            colors: 'var(--mui-palette-text-disabled)',
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize
          }
        }
      }
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '13px',
      fontFamily: theme.typography.fontFamily,
      labels: { colors: 'var(--mui-palette-text-secondary)' },
      itemMargin: { horizontal: 12 },
      markers: {
        width: 12,
        height: 12,
        radius: 10,
        offsetY: 1,
        offsetX: theme.direction === 'rtl' ? 7 : -4
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        {
          formatter: (value) => `${value.toLocaleString()} FCFA`
        },
        {
          formatter: (value) => `${value} commandes`
        }
      ]
    }
  }

  const series = [
    {
      name: 'Revenus',
      type: 'line',
      data: salesData.salesData,
      yAxisIndex: 0
    },
    {
      name: 'Commandes',
      type: 'line',
      data: salesData.ordersData,
      yAxisIndex: 1
    }
  ]

  const getPeriodLabel = () => {
    switch (period) {
      case 'day':
        return `Jour - ${selectedDate.toLocaleDateString('fr-FR')}`
      case 'month':
        return `Mois - ${selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`
      case 'year':
        return `Année - ${selectedDate.getFullYear()}`
      default:
        return 'Période'
    }
  }

  return (
    <Card>
      <CardHeader 
        title="Statistiques de Vente"
        subheader={getPeriodLabel()}
      />
      <CardContent>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Filtres de période */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Période d'affichage
            </Typography>
            <ButtonGroup variant="outlined" size="small">
              <Button
                variant={period === 'day' ? 'contained' : 'outlined'}
                onClick={() => setPeriod('day')}
              >
                Jour
              </Button>
              <Button
                variant={period === 'month' ? 'contained' : 'outlined'}
                onClick={() => setPeriod('month')}
              >
                Mois
              </Button>
              <Button
                variant={period === 'year' ? 'contained' : 'outlined'}
                onClick={() => setPeriod('year')}
              >
                Année
              </Button>
            </ButtonGroup>
          </Grid>

          {/* Sélecteur de date */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {period === 'day' ? 'Sélectionner un jour' : 
               period === 'month' ? 'Sélectionner un mois' : 
               'Sélectionner une année'}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                views={period === 'year' ? ['year'] : period === 'month' ? ['year', 'month'] : ['year', 'month', 'day']}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: false
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        {/* Statistiques résumées */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="h6" color="primary">
                {salesData.totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenus totaux (FCFA)
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="h6" color="secondary">
                {salesData.totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total commandes
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="h6" color="success.main">
                {salesData.totalOrders > 0 ? Math.round(salesData.totalRevenue / salesData.totalOrders).toLocaleString() : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Panier moyen (FCFA)
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="h6" color="warning.main">
                {salesData.labels.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Points de données
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Graphique */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
            <Typography>Chargement des données...</Typography>
          </Box>
        ) : (
          <AppReactApexCharts
            type='line'
            height={350}
            width='100%'
            series={series}
            options={chartOptions}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default SalesChart
