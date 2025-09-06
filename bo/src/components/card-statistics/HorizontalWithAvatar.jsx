// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

const HorizontalWithAvatar = props => {
  // Props
  const { stats, title, avatarIcon, avatarColor, avatarVariant, avatarSkin, avatarSize, gradient } = props

  return (
    <Card sx={{
      background: '#5F3AFC20', 
      boxShadow: 'none',
      border: '1px solid rgb(207, 207, 207)',
      borderBottom: '2px solid #5F3AFC'
    }}>
      <CardContent className=' h-[80px] flex items-center justify-between gap-2'>
        <div className='flex flex-col items-start gap-1'>
          <Typography variant='h5'>{stats}</Typography>
          <Typography variant='body2' whiteSpace={'nowrap'}>{title}</Typography>
        </div>
        <CustomAvatar color='primary' variant='rounded' size={avatarSize}>
          <i className={avatarIcon} style={{ color: 'white' }} />
        </CustomAvatar>
      </CardContent>
    </Card>
  )
}

export default HorizontalWithAvatar
