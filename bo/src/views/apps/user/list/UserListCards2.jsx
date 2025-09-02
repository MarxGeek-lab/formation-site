// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Vars
const data = [
  {
    title: 'Utilisateurs connectés',
    stats: '21,459',
    avatarIcon: 'tabler-users',
    avatarColor: 'primary',
    trend: 'positive',
    // trendNumber: '29%',
    subtitle: 'dernière analyse'
  },
  {
    title: 'Utilisateurs actif',
    stats: '19,860',
    avatarIcon: 'tabler-user-check',
    avatarColor: 'success',
    trend: 'negative',
    trendNumber: '14%',
    subtitle: 'dernière analyse'
  },
  {
    title: 'Utilisateurs inactif',
    stats: '4,567',
    avatarIcon: 'tabler-user-plus',
    avatarColor: 'error',
    trend: 'positive',
    trendNumber: '18%',
    subtitle: 'dernière analyse'
  },
  {
    title: 'Utilisateurs en attente',
    stats: '237',
    avatarIcon: 'tabler-user-search',
    avatarColor: 'warning',
    trend: 'positive',
    trendNumber: '42%',
    subtitle: 'dernière analyse'
  }
]

const UserListCards2 = () => {
  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default UserListCards2
