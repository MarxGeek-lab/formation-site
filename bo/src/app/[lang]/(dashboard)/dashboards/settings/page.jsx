// Next Imports
import dynamic from 'next/dynamic'
import Settings from './settings'

const StoreDetailsTab = dynamic(() => import('./settings/store-details'))

const tabContentList = () => ({
  'store-details': <StoreDetailsTab />,
})

const eCommerceSettings = () => {
  return <Settings tabContentList={tabContentList()} />
}

export default eCommerceSettings
