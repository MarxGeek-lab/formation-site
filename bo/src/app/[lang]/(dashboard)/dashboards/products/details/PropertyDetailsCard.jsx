'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'

import { Chip } from '@mui/material'
import { colors, statePropertys, statesProperty } from '@/data/constant'
import dayjs from 'dayjs'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}


const PropertyDetailsCard = ({ product }) => {
  const statusProduct = {
    active: { title: 'Actif', color: 'success' },
    inactive: { title: 'Inactif', color: 'error' },
    draft: { title: 'Brouillon', color: 'warning' }
  }

  return (
    <Card>
      <CardHeader
        title='Details du produit'
      />
      <CardContent className='flex flex-col gap-4'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
        <Typography color='text.primary' className='min-w-[100px] text-nowrap'>
          Nom du produit :
        </Typography>
        <Typography color='text.primary' className='font-medium'>
          {product?.name}
        </Typography>
      </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Categorie :
          </Typography>
          <Chip
            label={product?.category}
            variant='tonal'
            // color={'secondary'}
            size='medium'
          /> 
        </div>
        {!product?.isSubscriptionBased ? (
          <>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
              <Typography color='text.primary' className='min-is-[100px]'>
                Prix :
              </Typography>
              <Typography color='text.primary' className='font-medium'>
                  {product?.price} FCFA
              </Typography>
            </div>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
              <Typography color='text.primary' className='min-is-[100px]'>
                Prix de promotion :
              </Typography>
              <Typography color='text.primary' className='font-medium'>
                  {product?.pricePromo ? product?.pricePromo + " FCFA" : "non définie"}
              </Typography>
            </div>
          </>
        ): (
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Abonnement :
          </Typography>
          <Typography color='text.primary' className='font-medium'>
              {product?.subscriptionId?.title}
          </Typography>
        </div>
        )}
        
     
        <div className='flex flex-wrap items-start gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Description :
          </Typography>
          <div color='text.primary' className='font-medium'>
            <div dangerouslySetInnerHTML={{ __html: product?.description || 'non définie' }} />
          </div>
        </div>

        {product?.characteristics?.length > 0 && (
          <div className='flex flex-col items-start gap-1'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Autres caractéristiques :
            </Typography>
            <Typography color='text.primary' className='font-medium'>
            {product?.characteristics?.map((characteristic, index) => (
              <div key={index} style={{
                borderBottom: '1px dashed #ccc'
              }}>
                <Typography color='text.primary'>{characteristic.key} : {characteristic.value}</Typography>
              </div>
            ))}
          </Typography>
        </div>
        )}
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Status du produit:
            </Typography>
            <Chip
              label={product?.productStatus && statusProduct[product?.productStatus]?.title}
              variant='tonal'
              color={statusProduct[product?.productStatus].color}
              size='medium'
            /> 
          </div>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Nombre de commentaires:
            </Typography>
            <Chip
              label={product?.reviews?.length || 0}
              variant='tonal'
              color={'secondary'}
              size='medium'
            /> 
          </div>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Date de création:
            </Typography>
            <Typography color='text.primary' className='font-medium'>
              {dayjs(product?.createdAt).format('DD/MM/YYYY HH:mm:ss')}
            </Typography>
          </div>
        </CardContent>
    </Card>
  )
}

export default PropertyDetailsCard
