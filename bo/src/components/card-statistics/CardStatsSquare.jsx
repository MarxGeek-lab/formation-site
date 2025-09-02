// MUI imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const CardStatsSquare = props => {
  // Props
  const { avatarColor, avatarIcon, stats, statsTitle, avatarVariant, avatarSize, avatarSkin } = props

  return (
    <Card>
      <CardContent className='flex flex-col items-center gap-2' style={{backgroundColor: 'var(--mui-palette-primary-main)'}}>
        <CustomAvatar color={'white'} skin={'white'} variant={''} size={avatarSize}>
          <i className={avatarIcon} />
        </CustomAvatar>
        <div className='flex flex-col items-center gap-1'>
          <Typography variant='h5' color='white'>{stats}</Typography>
          <Typography color='white'>{statsTitle}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}

export default CardStatsSquare
