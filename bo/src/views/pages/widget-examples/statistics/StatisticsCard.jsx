// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'


const StatisticsCard = ({ stats }) => {

 const data = [
  {
    stats: stats?.reservation?.countCompleted || 0,
    title: 'Terminées',
    color: 'success',
    icon: 'tabler-checks'
  },
  {
    stats: stats?.reservation?.countConfirmed || 0,
    title: 'Confirmées',
    color: 'success',
    icon: 'tabler-checks'
  },
  {
    color: 'info',
    stats: stats?.reservation?.countProgress || 0,
    title: 'En cours',
    icon: 'tabler-progress'
  },
  {
    color: 'warning',
    stats: stats?.reservation?.countPending || 0,
    title: 'En attente',
    icon: 'tabler-pending'
  },
  {
    stats: stats?.reservation?.countCancelled || 0,
    color: 'error',
    title: 'Annulées',
    icon: 'tabler-x'
  }
]

  return (
    <Card className='md:h-[150px] sm:h-auto'>
      <CardHeader
        title='Statistique réservations'
        action={
          <Typography variant='subtitle2' color='text.disabled'>
            {/* Updated 1 month ago */}
          </Typography>
        }
      />
      <CardContent className='flex justify-between flex-wrap gap-4'>
        <Grid container spacing={4} flex={1}>
          {data.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index} className='flex gap-4 items-center'>
              <CustomAvatar color={item.color} variant='rounded' size={40} skin='light'>
                <i className={item.icon}></i>
              </CustomAvatar>
              <div>
                <Typography variant='h5' noWrap>{item.stats}</Typography>
                <Typography variant='body2' noWrap>{item.title}</Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
