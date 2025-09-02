// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import UserListTable from './UserListTable'
import UserListCards2 from './UserListCards2'

const UserList = ({ userData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserListCards2 />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserListTable tableData={userData} />
      </Grid>
    </Grid>
  )
}

export default UserList
