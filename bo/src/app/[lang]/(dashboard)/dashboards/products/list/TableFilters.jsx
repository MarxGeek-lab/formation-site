// React Imports
import { useState, useEffect, useMemo } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { Box, Typography } from '@mui/material'

// Vars
const productStockObj = {
  'In Stock': 'true',
  'Out of Stock': 'false'
}

const TableFilters = ({ setData, productData }) => {
  // States
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  const categories = useMemo(() => {
    const uniqueCategories = new Set(productData?.map(item => item.category).filter(Boolean));
    return Array.from(uniqueCategories).sort();
  }, [productData]);

  useEffect(
    () => {
      const filteredData = productData.filter(property => {
        if (category && category !== 'tout' && property.category !== category) return false
        if (stock && property.stock !== productStockObj[stock]) return false
        if (status && status !== 'tout' && property.productStatus !== status) return false
        if (type && type !== 'tout' && property.productType !== type) return false

        return true
      })

      setData(filteredData)
    },
    [category, stock, status, type, productData]
  )

  return (
    <CardContent>
      <Box className='flex flex-wrap gap-3'>
        <Typography variant='subtitle1' mr={2}>Filtrer par </Typography>
        <CustomTextField
          select
          id='select-status'
          value={status}
          onChange={e => setStatus(e.target.value)}
          slotProps={{
            select: { displayEmpty: true }
          }}
          className='min-is-[130px] text-sm'
        >
          <MenuItem value=''>Status du produit</MenuItem>
          <MenuItem value='tout'>Tout</MenuItem>
          <MenuItem value='active'>Actif</MenuItem>
          <MenuItem value='inactive'>Inactif</MenuItem>
        </CustomTextField>
        <CustomTextField
          select
          id='select-category'
          value={category}
          onChange={e => setCategory(e.target.value)}
          slotProps={{
            select: { displayEmpty: true }
          }}
          className='min-is-[130px] text-sm'
        >
          <MenuItem value=''>Filtrer par catégorie</MenuItem>
          <MenuItem value='tout'>Tout</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </CustomTextField>
        <CustomTextField
          select
          id='select-status'
          value={status}
          onChange={e => setStatus(e.target.value)}
          slotProps={{
            select: { displayEmpty: true }
          }}
          className='min-is-[130px] text-sm'
        >
          <MenuItem value='' defaultChecked>Type de produit</MenuItem>
          <MenuItem value='tout'>Tout</MenuItem>
          <MenuItem value='standard'>Standard</MenuItem>
          <MenuItem value='mystere'>Mystère</MenuItem>
        </CustomTextField>
      </Box>
    </CardContent>
  )
}

export default TableFilters
