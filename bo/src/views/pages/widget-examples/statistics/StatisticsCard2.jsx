// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const data = [
  {
    stats: '230k',
    title: 'en attente',
    color: 'warning',
    icon: 'tabler-home'
  },
  {
    color: 'success',
    stats: '8.549k',
    title: 'validé',
    icon: 'tabler-home'
  },
  {
    color: 'error',
    stats: '1.423k',
    title: 'rejetée',
    icon: 'tabler-home'
  },
  {
    stats: '$9745',
    color: 'primary',
    title: 'Total',
    icon: 'tabler-home'
  }
]

const StatisticsCard2 = ({ stats }) => {
  return (
    <Card>
      <CardHeader
        title='Propriétés'
        action={
          <Typography variant='subtitle2' color='text.disabled'>
            {/* Updated 1 month ago */}
          </Typography>
        }
      />
      <CardContent className='flex justify-between flex-wrap gap-4'>
        <Grid container spacing={4} flex={1}>
          {data.map((item, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index} className='flex gap-4 items-center'>
              <CustomAvatar color={item.color} variant='rounded' size={40} skin='light'>
                <i className={item.icon}></i>
              </CustomAvatar>
              <div>
                <Typography variant='h5'>{item.stats}</Typography>
                <Typography variant='body2'>{item.title}</Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard2
