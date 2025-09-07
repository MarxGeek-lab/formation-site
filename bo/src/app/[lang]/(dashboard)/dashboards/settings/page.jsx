// Next Imports
import dynamic from 'next/dynamic'
import Settings from './settings'
import { useSiteSettings } from '@/contexts/GlobalContext';

// Component Imports

const StoreDetailsTab = dynamic(() => import('./settings/store-details'))
// const PaymentsTab = dynamic(() => import('./settings/payments'))
// const CheckoutTab = dynamic(() => import('./settings/checkout'))
// const ShippingDeliveryTab = dynamic(() => import('./settings/ShippingDelivery'))
const LocationsTab = dynamic(() => import('./settings/locations'))
// const NotificationsTab = dynamic(() => import('./settings/Notifications'))
const CartRemindersTab = dynamic(() => import('./settings/store-details/cart-reminders'))

const tabContentList = () => ({
  'store-details': <StoreDetailsTab />,
  'cart-reminders': <CartRemindersTab />
})

const eCommerceSettings = () => {

  return <Settings tabContentList={tabContentList()} />
}

export default eCommerceSettings
