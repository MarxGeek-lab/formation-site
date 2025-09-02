// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomerDetailsHeader from './CustomerDetailsHeader'
import CustomerLeftOverview from './customer-left-overview'
import CustomerRight from './customer-right'

const OverViewTab = dynamic(() => import('./customer-right/overview'))
const PaymentsTab = dynamic(() => import('./customer-right/payments'))
const SecurityTab = dynamic(() => import('./customer-right/security'))

const AddressBillingTab = dynamic(
  () => import('./customer-right/address-billing')
)

// Vars

const CustomerDetails = ({ customerData, customerId }) => {
  const tabContentList = () => ({
    overview: <OverViewTab orders={customerData?.ordersList} />,
    payments: <PaymentsTab payments={customerData?.payments} />,
    addressBilling: <AddressBillingTab addressShipping={customerData?.customer?.addressShipping} />,
  /*   security: <SecurityTab />,
    notifications: <NotificationsTab /> */
  })

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CustomerDetailsHeader customer={customerData?.customer} customerId={customerId} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CustomerLeftOverview customerData={customerData?.customer} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        {/* <OverViewTab orders={customerData?.ordersList} /> */}
        <CustomerRight tabContentList={tabContentList()} />
      </Grid>
    </Grid>
  )
}

export default CustomerDetails
