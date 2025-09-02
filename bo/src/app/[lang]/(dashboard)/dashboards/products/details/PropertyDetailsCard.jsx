'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import Link from '@components/Link'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import dayjs from '@/configs/dayjs.config';
import { Avatar, Badge, Chip } from '@mui/material'
import { formatAmount } from '@/utils/formatAmount'
import { colors, statePropertys, statesProperty } from '@/data/constant'

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
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Sous-categorie :
          </Typography>
          <Chip
            label={product?.subCategory}
            variant='tonal'
            // color={'secondary'}
            size='medium'
          /> 
        </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Prix :
          </Typography>
          <Typography color='text.primary' className='font-medium'>
              {product?.price}
          </Typography>
        </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Prix de vente en gros :
          </Typography>
          <Typography color='text.primary' className='font-medium'>
              {product?.wholesalePrice}
          </Typography>
        </div>

        {product?.taxe && (
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              TVA :
            </Typography>
            <Typography color='text.primary' className='font-medium'>
                {product?.taxe} %
            </Typography>
          </div>
        )}
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Prix de vente en gros :
          </Typography>
          <Typography color='text.primary' className='font-medium'>
              {product?.wholesalePrice}
          </Typography>
        </div>
     
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Description :
          </Typography>
          <div color='text.primary' className='font-medium'>
            <div dangerouslySetInnerHTML={{ __html: product?.description || 'non définie' }} />
          </div>
        </div>

        {product?.material && (
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Matériel :
            </Typography>
            <Typography color='text.primary' className='font-medium'>
                {product?.material}
            </Typography>
          </div>

        )}

        {product?.weight && (
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Poids :
            </Typography>
            <Typography color='text.primary' className='font-medium'>
                {product?.weight}
            </Typography>
          </div>
        )}

        {product?.dimensions && (
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Dimensions :
            </Typography>
            <Typography color='text.primary' className='font-medium'>
                {product?.dimensions}
            </Typography>
          </div>
        )}

        {product?.brand && (
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Marque :
            </Typography>
            <Typography color='text.primary' className='font-medium'>
                {product?.brand}
            </Typography>
          </div>
        )}

        {product?.productCode && (
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Code produit :
            </Typography>
            <Typography color='text.primary' className='font-medium'>
                {product?.productCode}
            </Typography>
          </div>
        )}

        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Stock Total :
          </Typography>
          <Chip
            label={product?.stock?.total}
            color='primary'
            variant='tonal'
            size='medium'
          />
        </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Stock disponible :
          </Typography>
          <Chip
            label={product?.stock?.available}
            color='primary'
            variant='tonal'
            size='medium'
          />
        </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Stock vendu :
          </Typography>
          <Chip
            label={product?.stock?.sold}
            color='primary'
            variant='tonal'
            size='medium'
          />
        </div>
        {product?.minStock && (
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Stock minimum avant alerte :
            </Typography>
            <Chip
              label={product?.minStock}
              color='primary'
              variant='tonal'
              size='medium'
            />
          </div>
        )}
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Colors :
          </Typography>
          <div className='flex gap-3'>
            {product?.color?.map((color, index) => (
              <Chip
                key={index}
                label={color}
                style={{
                  background: colors[color]?.color,
                  boxShadow: color === 'blanc' ? '0 0 2px 2px #ccc' : 'inherit',
                  color: color !== 'blanc' ? 'white': 'inherit' 
                }}
                variant='tonal'
                size='medium'
              />
            ))}
          </div>
        </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
          <Typography color='text.primary' className='min-is-[100px]'>
            Sizes :
          </Typography>
          <div className='flex gap-3'>
            {product?.size?.map((size, index) => (
              <Chip
                key={index}
                label={size?.toUpperCase()}
                color='primary'
                variant='tonal'
                size='medium'
              />
            ))}
          </div>
        </div>

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
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-5'>
            <Typography color='text.primary' className='min-is-[100px]'>
              Produit en vedette:
            </Typography>
            <Chip
              label={product?.isFeatured ? 'Oui' : 'Non'}
              variant='tonal'
              color={product?.isFeatured ? 'primary' : 'error'}
              size='medium'
            /> 
          </div>
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
        </CardContent>
    </Card>
  )
}

export default PropertyDetailsCard
