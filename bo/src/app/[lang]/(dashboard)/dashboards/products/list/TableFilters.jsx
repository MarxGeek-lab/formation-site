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
  const [status2, setStatus2] = useState('')

  const categories = useMemo(() => {
    const uniqueCategories = new Set(productData?.map(item => item.subCategory).filter(Boolean));
    return Array.from(uniqueCategories).sort();
  }, [productData]);

  useEffect(
    () => {
      const filteredData = productData.filter(property => {
        if (category && category !== 'tout' && property.subCategory !== category) return false
        if (stock && property.stock !== productStockObj[stock]) return false
        if (status && status !== 'tout' && property.statusValidate !== status) return false
        if (status2 && status2 !== 'tout' && property.availability !== status2) return false

        return true
      })

      setData(filteredData)
    },
    [category, stock, status, status2, productData]
  )

  return (
    <CardContent>
      <Box className='flex flex-wrap gap-3'>
        <Typography variant='h5' mr={2}>Filtrer par </Typography>
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
          <MenuItem value='draft'>Brouillon</MenuItem>
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
      </Box>
    </CardContent>
  )
}

export default TableFilters
