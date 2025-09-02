// Next Imports
import dynamic from 'next/dynamic'
import Settings from './settings'
import { useSiteSettings } from '@/contexts/GlobalContext';

// Component Imports

const StoreDetailsTab = dynamic(() => import('./settings/store-details'))
const PaymentsTab = dynamic(() => import('./settings/payments'))
const CheckoutTab = dynamic(() => import('./settings/checkout'))
const ShippingDeliveryTab = dynamic(() => import('./settings/ShippingDelivery'))
const LocationsTab = dynamic(() => import('./settings/locations'))
const NotificationsTab = dynamic(() => import('./settings/Notifications'))

const tabContentList = () => ({
  'store-details': <StoreDetailsTab />,
  payments: <PaymentsTab />,
  checkout: <CheckoutTab />,
  'shipping-delivery': <ShippingDeliveryTab />,
  locations: <LocationsTab />,
  notifications: <NotificationsTab />
})

const eCommerceSettings = () => {

  return <Settings tabContentList={tabContentList()} />
}

export default eCommerceSettings
