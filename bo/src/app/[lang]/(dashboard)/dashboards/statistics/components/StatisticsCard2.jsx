// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'


const StatisticsCard2 = ({ propertyStats }) => {
  const data = [
    {
      stats: propertyStats?.countPending || 0,
      title: 'En attente',
      color: 'warning',
      icon: 'tabler-progress'
    },
    {
      color: 'success',
      stats: propertyStats?.countApproved || 0,
      title: 'Validé',
      icon: 'tabler-home'
    },
    {
      color: 'error',
      stats: propertyStats?.countRejected || 0,
      title: 'Rejetée',
      icon: 'tabler-x'
    }
  ]

  return (
    <Card className='md:h-[150px] sm:h-auto'>
      <CardHeader
        title='Statistique Biens'
        action={
          <Typography variant='subtitle2' color='text.disabled'>
            {/* Updated 1 month ago */}
          </Typography>
        }
      />
      <CardContent className='flex justify-between flex-wrap gap-4'>
        <Grid container spacing={2} flex={1}>
          {data.map((item, index) => (
            <Grid size={{ xs: 12, sm: 4 }} key={index} className='flex gap-4 items-center'>
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

export default StatisticsCard2
