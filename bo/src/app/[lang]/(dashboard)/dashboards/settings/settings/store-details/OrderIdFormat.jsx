// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useState } from 'react'
import { Button, Checkbox, FormControlLabel, MenuItem, Select } from '@mui/material'

const OrderIdFormat = ({
  taxe, setTaxe, shipping, setShipping,
  warranty, setWarranty, currency, setCurrency
}) => {
  const handleAddCharacteristic = () => {
    setShipping([...shipping, { name: '', delay: { min: 0, max: 0, unit: 'jour' }, fee: 0, description: '', isDefault: false }]);
  };

  const handleCharacteristicChange = (index, field, value) => {
    const newShipping = [...shipping];
    if (field === 'min' || field === 'max' || field === 'unit') {
      console.log('delay', value)
      newShipping[index].delay[field] = value;
    } else {
      newShipping[index][field] = value;
    }
    setShipping(newShipping);
  };

  const handleRemoveCharacteristic = (index) => {
    const newShipping = [...shipping];
    newShipping.splice(index, 1);
    setShipping(newShipping);
  };

  return (
    <Card>
      <Typography variant="h5" fontWeight={600} className="mx-6 mt-4">
        Méthodes de livraison
      </Typography>
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            {shipping.map((method, index) => (
              <Grid container spacing={2} key={index} className="mbs-2 flex items-end">
                {/* Nom */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Méthode de livraison'
                    value={method.name}
                    onChange={(e) => handleCharacteristicChange(index, 'name', e.target.value)}
                  >
                    <MenuItem key={"Livraison express"} value={"Livraison express"}>Livraison express</MenuItem>
                    <MenuItem key={"Livraison standard"} value={"Livraison standard"}>Livraison standard</MenuItem>
                    <MenuItem key={"Livraison gratuit"} value={"Livraison gratuit"}>Livraison gratuit</MenuItem>
                    <MenuItem key={"Retirer en magasin"} value={"Retirer en magasin"}>Retirer en magasin</MenuItem>
                  </CustomTextField>
                </Grid>

                {/* Délai min */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <CustomTextField
                    type="number"
                    fullWidth
                    value={method.delay.min}
                    onChange={(e) => handleCharacteristicChange(index, 'min', Number(e.target.value))}
                    label="Délai min"
                    disabled={method.name === "livraison gratuit" || method.name === "Retirer en magasin"}
                  />
                </Grid>

                {/* Délai max */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <CustomTextField
                    type="number"
                    fullWidth
                    value={method.delay.max}
                    onChange={(e) => handleCharacteristicChange(index, 'max', Number(e.target.value))}
                    label="Délai max"
                    disabled={method.name === "livraison gratuit" || method.name === "Retirer en magasin"}
                  />
                </Grid>

                {/* Unité */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Unité'
                    value={method.delay.unit}
                    onChange={(e) => handleCharacteristicChange(index, 'unit', e.target.value)}
                    disabled={method.name === "livraison gratuit" || method.name === "Retirer en magasin"}
                  >
                    <MenuItem key={"jour"} value={"jour"}>Jour</MenuItem>
                    <MenuItem key={"heure"} value={"heure"}>Heure</MenuItem>
                  </CustomTextField>
                </Grid>

                {/* Frais */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <CustomTextField
                    type="number"
                    fullWidth
                    value={method.fee}
                    onChange={(e) => handleCharacteristicChange(index, 'fee', Number(e.target.value))}
                    label={`Frais (${currency})`}
                    disabled={method.name === "livraison gratuit" || method.name === "Retirer en magasin"}
                  />
                </Grid>

                {/* Description */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <CustomTextField
                    multiline
                    rows={2}
                    fullWidth
                    value={method.description}
                    onChange={(e) => handleCharacteristicChange(index, 'description', e.target.value)}
                    label="Description"
                  />
                </Grid>

                {/* Par défaut */}
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={method.isDefault}
                        onChange={(e) => handleCharacteristicChange(index, 'isDefault', e.target.checked)}
                      />
                    }
                    label="Par défaut"
                  />
                </Grid>

                

                {/* Pays disponibles */}
                {/* <Grid size={{ xs: 12, md: 4 }}>
                  <Select
                    fullWidth
                    multiple
                    value={method.availableCountries}
                    onChange={(e) => handleCharacteristicChange(index, 'availableCountries', e.target.value)}
                    options={[
                      { value: 'BJ', label: 'Bénin' },
                      { value: 'TG', label: 'Togo' },
                      { value: 'CI', label: 'Côte d’Ivoire' }
                    ]}
                    label="Pays disponibles"
                  />
                </Grid> */}

                

                {/* Boutons ajout/suppression */}
                <Grid size={{ xs: 12, md: 2 }} className="flex items-center">
                  {index === shipping.length - 1 ? (
                    <Button variant="contained" onClick={handleAddCharacteristic} className="mie-2">
                      <i className="tabler-plus" />
                    </Button>
                  ) : (
                    <Button variant="outlined" color="error" onClick={() => handleRemoveCharacteristic(index)}>
                      <i className="tabler-trash" />
                    </Button>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              fullWidth
              label='Taxe sur les commandes'
              placeholder='0'
              type='number'
              value={taxe}
              onChange={(e) => setTaxe(Number(e.target.value))}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position='end'>%</InputAdornment>
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              fullWidth
              label='Garantie après achat'
              placeholder='0'
              type='number'
              value={warranty}
              onChange={(e) => setWarranty(Number(e.target.value))}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position='end'>en jour</InputAdornment>
                }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              fullWidth
              label='Devise'
              placeholder='XOF'
              type='text'
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default OrderIdFormat
