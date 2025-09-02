'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// Third-party Imports
import classnames from 'classnames'

// Vars

const Header = ({ stats }) => {
  // Hooks
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const data = [
    {
      title: stats?.completed,
      subtitle: 'Réussie',
      icon: 'tabler-checks',
      gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' // vert dégradé
    },
    {
      title: stats?.pending,
      subtitle: 'En cours',
      icon: 'tabler-file-invoice',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' // jaune → orange
    },
    {
      title: stats?.failed,
      subtitle: 'Echoué',
      icon: 'tabler-circle-off',
      gradient: 'linear-gradient(135deg, #f85032 0%, #e73827 100%)' // rouge dégradé
    }
  ];
  

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          {data.map((item, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={index}
              className={classnames({
                '[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie':
                  isBelowMdScreen && !isBelowSmScreen,
                '[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie': !isBelowMdScreen
              })}
            >
              <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                  <Typography variant='h4'>{item.title}</Typography>
                  <Typography>{item.subtitle}</Typography>
                </div>
                <Avatar variant='rounded' className='is-[42px] bs-[42px]'>
                  <i className={classnames(item.icon, 'text-[26px]')} />
                </Avatar>
              </div>
              {isBelowMdScreen && !isBelowSmScreen && index < data.length - 2 && (
                <Divider
                  className={classnames('mbs-6', {
                    'mie-6': index % 2 === 0
                  })}
                />
              )}
              {isBelowSmScreen && index < data.length - 1 && <Divider className='mbs-6' />}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Header
