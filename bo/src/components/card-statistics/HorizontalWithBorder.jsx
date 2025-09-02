'use client'

// MUI Imports
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

//Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

const Card = styled(MuiCard)(({ color }) => ({
  transition: 'border 0.3s ease-in-out, box-shadow 0.3s ease-in-out, margin 0.3s ease-in-out',
  borderBottomWidth: '2px',
  borderBottomColor: `var(--mui-palette-${color}-darkerOpacity)`,
  '[data-skin="bordered"] &:hover': {
    boxShadow: 'none'
  },
  background: color,
  '&:hover': {
    borderBottomWidth: '3px',
    borderBottomColor: `var(--mui-palette-${color}-main) !important`,
    boxShadow: 'var(--mui-customShadows-lg)',
    marginBlockEnd: '-1px'
  }
}))

const HorizontalWithBorder = props => {
  // Props
  const { title, avatarIcon, color, gradient, stats } = props

  return (
    // <Card sx={{background: gradient, boxShadow: 'none'}} >
      <CardContent className='flex flex-col gap-1' sx={{background: gradient, borderRadius: 1}}>
        <div className='flex items-center gap-4' sx={{background: color}}>
          <CustomAvatar color={'white'} variant='rounded'>
            <i style={{color: 'white'}} className={classnames(avatarIcon, 'text-[28px]')} />
          </CustomAvatar>
          <Typography variant='h5' color='white'>{stats}</Typography>
        </div>
        <div className='flex flex-col gap-1'>
          <Typography color='white'>{title}</Typography>
        </div>
      </CardContent>
    // </Card>
  )
}

export default HorizontalWithBorder
