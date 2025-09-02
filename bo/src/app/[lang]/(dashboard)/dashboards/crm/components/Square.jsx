// MUI Imports
import CustomAvatar from '@/@core/components/mui/Avatar'
import { Card, CardContent, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

const Square2 = ({ stats, statsTitle, avatarIcon  }) => {
    return (
      <Grid container spacing={6} >
        <Grid size={{ xs: 12 }}>
          <Card className=''>
            <CardContent className='flex flex-col items-center gap-2 md:h-[150px] sm:h-auto' style={{backgroundColor: 'var(--mui-palette-primary-main)'}}>
              <CustomAvatar color={'white'} skin={'white'} variant={''} size={40}>
                <i className={avatarIcon} />
              </CustomAvatar>
              <div className='flex flex-col items-center gap-1'>
                <Typography variant='h5' color='white'>{stats}</Typography>
                <Typography color='white'>{statsTitle}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  
}

export default Square2
