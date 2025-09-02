// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

const BillingInformation = ({
  country, setCountry,
  businessName, setBusinessName,
  address, setAddress,
  city, setCity
}) => {
  

  return (
    <Card>
      <Typography variant="h5" fontWeight={600} className="mx-6 mt-4">
        Informations support
      </Typography>
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label="Nom légal de l'entreprise" 
              placeholder='locapay' 
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Pays'
              value={country}
              onChange={e => setCountry(e.target.value)}
            >
              <MenuItem value=''>Sélectionner</MenuItem>
              <MenuItem value='India'>Benin</MenuItem>
              <MenuItem value='Canada'>Canada</MenuItem>
              <MenuItem value='UK'>UK</MenuItem>
              <MenuItem value='United States'>United States</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Ville' 
              placeholder='cotonou' 
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Adresse' 
              placeholder='126, New Street' 
              value={address}
              onChange={e => setAddress(e.target.value)}
              />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default BillingInformation
