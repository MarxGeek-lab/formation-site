// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import { Chip } from '@mui/material'

const StoreCurrency = ({
  currency, setCurrency,
  paymentGateways, setPaymentGateways
}) => {
  // States
  const paymentGateway =  ['MTN', 'MOOV', 'CELTIIS'];

  return (
    <Card>
      <CardHeader title='Paiement' subheader='Définissez les moyens de paiement et la devise' />
      <CardContent>
        <Grid spacing={6} container>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              select
              fullWidth
              label='Devise'
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <MenuItem value=''>Sélectionner</MenuItem>
              <MenuItem value='XOF'>XOF</MenuItem>
              <MenuItem value='USD'>USD</MenuItem>
              <MenuItem value='Euro'>Euro</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomAutocomplete
              fullWidth
              multiple
              value={paymentGateways}
              onChange={(event, value) => setPaymentGateways(value)} // Évite les valeurs vides
              options={paymentGateway}
              getOptionLabel={(option) => option}
              renderInput={(params) => <CustomTextField {...params} label="Type d'utilisateurs" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} size="small" {...getTagProps({ index })} key={index} />
                ))
              }
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StoreCurrency
