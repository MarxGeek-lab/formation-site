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
import { useTheme } from '@mui/material/styles'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fr } from 'date-fns/locale'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

// API Imports
import api from '@/configs/api'

const SalesByCountryChart = () => {
  // States
  const [period, setPeriod] = useState('year')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [countryData, setCountryData] = useState({
    countries: [],
    totalRevenue: 0,
    totalOrders: 0,
    topCountriesCount: 0
  })
  const [loading, setLoading] = useState(true)

  // Hooks
  const theme = useTheme()

  // Fetch country sales data
  const fetchCountryData = async () => {
    try {
      setLoading(true)
      const params = {
        year: selectedDate.getFullYear(),
        limit: 10
      }
      
      if (period === 'month') {
        params.month = selectedDate.getMonth() + 1
      }
      
      const response = await api.get('/stats/sales-by-country', { params })
      setCountryData(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des données par pays:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCountryData()
  }, [period, selectedDate])

  // Chart options for donut chart
  const chartOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    colors: [
      'var(--mui-palette-primary-main)',
      'var(--mui-palette-secondary-main)',
      'var(--mui-palette-success-main)',
      'var(--mui-palette-warning-main)',
      'var(--mui-palette-error-main)',
      'var(--mui-palette-info-main)',
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4'
    ],
    labels: countryData.countries.map(country => country.country),
    legend: {
      position: 'bottom',
      fontSize: '13px',
      fontFamily: theme.typography.fontFamily,
      labels: { colors: 'var(--mui-palette-text-secondary)' }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontFamily: theme.typography.fontFamily,
              color: 'var(--mui-palette-text-primary)'
            },
            value: {
              show: true,
              fontSize: '14px',
              fontFamily: theme.typography.fontFamily,
              color: 'var(--mui-palette-text-secondary)',
              formatter: (val) => `${parseFloat(val).toFixed(1)}%`
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '16px',
              fontFamily: theme.typography.fontFamily,
              color: 'var(--mui-palette-text-primary)',
              formatter: () => `${countryData.totalRevenue.toLocaleString()} FCFA`
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${parseFloat(val).toFixed(1)}%`
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) => {
          const country = countryData.countries[seriesIndex]
          return `${country?.totalRevenue.toLocaleString()} FCFA (${country?.totalOrders} commandes)`
        }
      }
    }
  }

  const series = countryData.countries.map(country => country.revenuePercentage)

  const getPeriodLabel = () => {
    switch (period) {
      case 'month':
        return `Mois - ${selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`
      case 'year':
        return `Année - ${selectedDate.getFullYear()}`
      default:
        return 'Période'
    }
  }

  // Get flag emoji for country (basic implementation)
  const getCountryFlag = (countryName) => {
    const flags = {
      'France': '🇫🇷',
      'Cameroun': '🇨🇲',
      'Cameroon': '🇨🇲',
      'Côte d\'Ivoire': '🇨🇮',
      'Senegal': '🇸🇳',
      'Sénégal': '🇸🇳',
      'Mali': '🇲🇱',
      'Burkina Faso': '🇧🇫',
      'Niger': '🇳🇪',
      'Tchad': '🇹🇩',
      'Chad': '🇹🇩',
      'Gabon': '🇬🇦',
      'Congo': '🇨🇬',
      'RDC': '🇨🇩',
      'Madagascar': '🇲🇬',
      'Maroc': '🇲🇦',
      'Morocco': '🇲🇦',
      'Algérie': '🇩🇿',
      'Algeria': '🇩🇿',
      'Tunisie': '🇹🇳',
      'Tunisia': '🇹🇳'
    }
    return flags[countryName] || '🌍'
  }

  return (
    <Card>
      <CardHeader 
        title="Ventes par Pays"
        subheader={getPeriodLabel()}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Filtres */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Période d'affichage
            </Typography>
            <ButtonGroup variant="outlined" size="small">
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

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {period === 'month' ? 'Sélectionner un mois' : 'Sélectionner une année'}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <DatePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                views={period === 'year' ? ['year'] : ['year', 'month']}
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

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Graphique en donut */}
          <Grid size={{ xs: 12, md: 6 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
                <Typography>Chargement des données...</Typography>
              </Box>
            ) : countryData.countries.length > 0 ? (
              <AppReactApexCharts
                type='donut'
                height={350}
                width='100%'
                series={series}
                options={chartOptions}
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
                <Typography color="text.secondary">Aucune donnée disponible</Typography>
              </Box>
            )}
          </Grid>

          {/* Tableau détaillé */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Top {countryData.topCountriesCount} Pays
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Pays</TableCell>
                    <TableCell align="right">Revenus</TableCell>
                    <TableCell align="right">Commandes</TableCell>
                    <TableCell align="right">%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {countryData.countries.map((country, index) => (
                    <TableRow key={country.country}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ fontSize: '1.2em' }}>
                            {getCountryFlag(country.country)}
                          </span>
                          <Typography variant="body2">
                            {country.country}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {country.totalRevenue.toLocaleString()} FCFA
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={country.totalOrders} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography 
                          variant="body2" 
                          color={index < 3 ? 'success.main' : 'text.secondary'}
                          fontWeight={index < 3 ? 'medium' : 'normal'}
                        >
                          {country.revenuePercentage}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        {/* Statistiques résumées */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="h6" color="primary">
                {countryData.totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenus totaux (FCFA)
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="h6" color="secondary">
                {countryData.totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total commandes
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="h6" color="success.main">
                {countryData.topCountriesCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pays actifs
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="h6" color="warning.main">
                {countryData.totalOrders > 0 ? Math.round(countryData.totalRevenue / countryData.totalOrders).toLocaleString() : 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Panier moyen (FCFA)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SalesByCountryChart
