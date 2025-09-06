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
        <CustomAvatar color='primary' variant='rounded' size={38}>
          <i className={avatarIcon} style={{ color: 'white' }} />
        </CustomAvatar>
      </CardContent>
    </Card>
    // <Card color={color} sx={{ 
    //   background: '#5F3AFC20', 
    //   boxShadow: 'none',
    //   border: '1px solid rgb(207, 207, 207)',
    //   borderBottom: '2px solid #5F3AFC'
    // }}>
    //   <CardContent className='flex flex-row align-center justify-between gap-1 h-[85px]'>
    //     <div className='flex flex-col gap-0'>
    //       <Typography variant='h5'>{stats}</Typography>
    //       <Typography variant='body2' fontWeight={500}>{title}</Typography>
    //     </div>
    //     <CustomAvatar color='primary' variant='rounded' size={40}>
    //         <i style={{color: 'white'}} className={classnames(avatarIcon, 'text-[20px]')} />
    //       </CustomAvatar>
    //   </CardContent>
    // </Card>
  )
}

export default HorizontalWithBorder
