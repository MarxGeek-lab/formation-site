'use client'
// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import OrderDetailHeader from '../OrderDetailHeader'
import OrderDetailsCard from '../OrderDetailsCard'
import ShippingActivity from '../ShippingActivityCard'
import CustomerDetails from '../CustomerDetailsCard'
import ShippingAddress from '../ShippingAddressCard'
import BillingAddress from '../BillingAddressCard'
import { useOrderStore } from '@/contexts/GlobalContext'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import OrderPaymentDetailCard from '../OrderDetailsPaymentCard'

const OrderDetails = () => {
  const params = useParams();
  const { getOrderById } = useOrderStore();
  const [orderData, setOrderData] = useState(null);

  const getOrdersById = async () => {
    console.log(params)
    if (params && params?.id) {
      try {
        const data = await getOrderById(params.id);
        setOrderData(data);
        console.log(data)
      } catch (error) {
        console.log(error);
      }
    }
  }
  useEffect(() => {
    console.log("params == ", params)
    getOrdersById();
  }, [params]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <OrderDetailHeader orderData={orderData} order={orderData?._id} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <OrderDetailsCard orderData={orderData}/>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <OrderPaymentDetailCard orderData={orderData?.payments}/>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <CustomerDetails orderData={orderData?.customer} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ShippingAddress orderData={orderData?.shippingAddress} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            {/* <BillingAddress /> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default OrderDetails
