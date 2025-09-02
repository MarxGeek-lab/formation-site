// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import EditUserInfo from '@components/dialogs/edit-user-info'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'

const CustomerDetails = ({ customerData }) => {
  return (
    <Card>
      <CardContent className='flex flex-col pbs-12 gap-6'>
        <div className='flex flex-col justify-self-center items-center gap-6'>
          <div className='flex flex-col items-center gap-4'>
            <CustomAvatar src={customerData?.picture} variant='rounded' alt='Customer Avatar' size={120} />
            <div className='flex flex-col items-center text-center'>
              <Typography variant='h5'>{customerData?.name}</Typography>
              <Typography>Client ID USER-{customerData?._id?.toString()?.slice(0, 6).toUpperCase()}</Typography>
            </div>
          </div>
          {/* <div className='flex items-center justify-around gap-4 flex-wrap is-full'>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='tabler-shopping-cart' />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>{customerData?.order}</Typography>
                <Typography>Orders</Typography>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <CustomAvatar variant='rounded' skin='light' color='primary'>
                <i className='tabler-currency-dollar' />
              </CustomAvatar>
              <div>
                <Typography variant='h5'>${customerData?.totalSpent}</Typography>
                <Typography>Spent</Typography>
              </div>
            </div>
          </div> */}
        </div>
        <div className='flex flex-col gap-4'>
          <Typography variant='h5'>Détails</Typography>
          <Divider />
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <Typography color='text.primary' className='font-medium'>
                Nom complet:
              </Typography>
              <Typography>{customerData?.name}</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography color='text.primary' className='font-medium'>
                Email:
              </Typography>
              <Typography>{customerData?.email}</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography color='text.primary' className='font-medium'>
                Status:
              </Typography>
              <Chip label={customerData?.isActive ? 'Actif':'Non actif'} 
                variant='tonal' color={customerData?.isActive ? 'success':'error'} size='small' />
            </div>
            {/* <div className='flex items-center gap-2'>
              <Typography color='text.primary' className='font-medium'>
                Contact:
              </Typography>
              <Typography>{customerData?.phoneNumber}</Typography>
            </div> */}
            <div className='flex items-center gap-2'>
              <Typography color='text.primary' className='font-medium'>
                Pays:
              </Typography>
              <Typography>{customerData?.country || "--"}</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography color='text.primary' className='font-medium'>
                Ville:
              </Typography>
              <Typography>{customerData?.city || "--"}</Typography>
            </div>
            <div className='flex items-center gap-2'>
              <Typography color='text.primary' className='font-medium'>
                Adresse:
              </Typography>
              <Typography>{customerData?.address || "--"}</Typography>
            </div>
          </div>
        </div>
        {/* <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={EditUserInfo} /> */}
      </CardContent>
    </Card>
  )
}

export default CustomerDetails
