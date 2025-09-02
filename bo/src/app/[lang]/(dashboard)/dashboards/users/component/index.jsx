// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomerDetailsHeader from './CustomerDetailsHeader'
import CustomerLeftOverview from './customer-left-overview'
import CustomerRight from './customer-right'

const OverViewTab = dynamic(() => import('./customer-right/overview'))
const ReservationTab = dynamic(() => import('./customer-right/reservation'));
const RentalTab = dynamic(() => import('./customer-right/rental'));
const PaymentsTab = dynamic(() => import('./customer-right/payments'));

// Vars
const tabContentList = (data) => ({
  overview: <OverViewTab userData={data} />,
  reservation: <ReservationTab reservation={data?.reservations} />,
  rental: <RentalTab rental={data?.rentals} />,
  payments: <PaymentsTab /> 
})

const CustomerDetails = ({ userData, fetchCustomer }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CustomerDetailsHeader fetchCustomer={fetchCustomer} userData={userData?.user} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomerLeftOverview customerData={userData?.user} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <CustomerRight tabContentList={tabContentList(userData)} />
      </Grid>
    </Grid>
  )
}

export default CustomerDetails
