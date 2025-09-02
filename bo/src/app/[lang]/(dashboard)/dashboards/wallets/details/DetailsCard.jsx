'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

import dayjs from '@/configs/dayjs.config';
import { formatAmount } from '@/utils/formatAmount'
import { Avatar, Chip } from '@mui/material'
import { API_URL_ROOT } from '@/settings'
import { statusPayObj } from '@/data/constant'

const DetailsCard = ({ withdrawalData }) => {
  return (
    <Card>
      <CardHeader
        title='Details de la demande'
      />
      <CardContent className='flex flex-col gap-4'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Montant demandé :
        </Typography>
        <Typography color='text.primary' className='font-medium'>
          {formatAmount(withdrawalData?.amount || 0)} F CFA
        </Typography>
      </div>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Méthode de paiement :
        </Typography>
        <Avatar
          variant='rounded'
          className={classnames('is-[50px] bs-[30px] bg-white')}
        >
          <img width={30} alt={withdrawalData?.paymentMethod} src={`${API_URL_ROOT}${withdrawalData?.method?.toLowerCase()}.png`} />
        </Avatar>
        <Typography color='text.primary' className='text-nowrap uppercase'>
          {withdrawalData?.method}
        </Typography>
      </div>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Numéro de réception :
        </Typography>
        <Typography color='text.primary' className='text-nowrap uppercase'>
          {withdrawalData?.numberWithdraw}
        </Typography>
      </div>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-is-[100px]'>
          Créé le :
        </Typography>
        <Typography color='text.primary' className='font-medium'>
          {withdrawalData?.createdAt && dayjs(withdrawalData?.createdAt).format('DD/MM/YYYY HH:mm:ss')}
        </Typography>
      </div>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Status :
        </Typography>
        <Chip
            variant='tonal'
            label={statusPayObj[withdrawalData.status]?.text}
            // label={statusPayObj[withdrawalData.status]?.title}
            color={statusPayObj[withdrawalData.status]?.color}
            size='small'
          />
      </div>
      {withdrawalData?.status !== 'pending' && (
        <>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Traité le :
            </Typography>
            <Typography color='text.primary' className='font-medium'>
              {withdrawalData?.processedAt && dayjs(withdrawalData?.processedAt).format('DD/MM/YYYY HH:mm:ss')}
            </Typography>
          </div>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Traité par :
            </Typography>
            <Typography color='text.primary' className='font-medium'>
              {withdrawalData?.validatedBy?.name}
            </Typography>
          </div>
          {withdrawalData?.status === 'rejected' && (
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
              <Typography color='text.primary' className='min-is-[100px]'>
                Motif :
              </Typography>
              <Typography color='text.primary' className='font-medium'>
                {withdrawalData?.reason}
              </Typography>
            </div>
          )}
        </>
        
      )}
      </CardContent>
    </Card>
  )
}

export default DetailsCard
