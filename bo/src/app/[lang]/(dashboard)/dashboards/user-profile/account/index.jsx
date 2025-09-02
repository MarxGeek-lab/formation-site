// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AccountDetails from './AccountDetails'
import AccountDelete from './AccountDelete'

const Account = ({ data }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AccountDetails data={data} />
      </Grid>
     {/*  <Grid size={{ xs: 12 }}>
        <AccountDelete />
      </Grid> */}
    </Grid>
  )
}

export default Account
