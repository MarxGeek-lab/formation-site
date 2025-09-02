'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Rating from '@mui/material/Rating'

// Vars

const TotalReviews = ({ stats }) => {
  // Hooks
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const totalReviewsData = [
    { rating: 5, value: stats?.starsCount[5] },
    { rating: 4, value: stats?.starsCount[4] },
    { rating: 3, value: stats?.starsCount[3] },
    { rating: 2, value: stats?.starsCount[2] },
    { rating: 1, value: stats?.starsCount[1] }
  ]

  return (
    <Card className='bs-full'>
      <CardContent>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <div className='flex flex-col items-start gap-2 is-full sm:is-6/12'>
            <div className='flex items-center gap-2'>
              <Typography variant='h3' color='primary.main'>
                {stats?.averageRating}
              </Typography>
              <i className='tabler-star-filled text-[32px] text-primary' />
            </div>
            <Typography className='font-bold' color='text.primary'>
              {stats?.totalReview} avis
            </Typography>
            {/* <Typography>Tous les commentaires proviennent de clients authentiques</Typography> */}
            {/* <Chip label='+5 This week' variant='tonal' size='small' color='primary' /> */}
          </div>
          <Divider orientation={isSmallScreen ? 'horizontal' : 'vertical'} flexItem />
          <div className='flex flex-col gap-3 is-full sm:is-6/12'>
            {totalReviewsData.map((item, index) => (
              <div key={index} className='flex items-center gap-2'>
                <Typography variant='body2' className='text-nowrap'>
                  {item.rating}
                </Typography>
                <LinearProgress
                  color='primary'
                  value={Math.floor((item.value / stats?.totalReview) * 100)}
                  variant='determinate'
                  className='bs-2 is-full'
                />
                <Typography variant='body2'>{item.value}</Typography>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TotalReviews
