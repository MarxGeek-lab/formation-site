'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import AddressBook from './AddressBookCard'
import PaymentMethod from './PaymentMethodCard'

const AddressBilling = ({ addressShipping }) => {
  console.log("addressShipping == ", addressShipping)
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AddressBook addressShipping={addressShipping} />
      </Grid>
      {/* <Grid size={{ xs: 12 }}>
        <PaymentMethod />
      </Grid> */}
    </Grid>
  )
}

export default AddressBilling
