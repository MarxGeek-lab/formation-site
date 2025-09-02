// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'

// Component Imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import CustomTextField from '@core/components/mui/TextField'
import DirectionalIcon from '@components/DirectionalIcon'
import { amenitiesByCategory, eventTypes, fuelTypes, vehicleBrands, vehicleModels, years } from '@/data/constant'
import { TextField, Typography } from '@mui/material'

const StepPropertyFeatures = ({ 
  activeStep, handleNext, handlePrev, steps,
  stateProperty, setStateProperty, setBedroom, setLivingRoom,
  setIsBalcony, setFeatures, setFloor, floor, features,
  bedroom, bathroom, livingRoom, isBalcony, setBathroom,
  category, model, brand, fuel, setModel, setBrand, setFuel,
  capacity, setCapacity, eventType, setEventType, year,
  setYear, subCategory, characteristics, setCharacteristics,
  otherFeatures, setOtherFeatures
}) => {
  // States
  const [isfloor, setIsFloor] = useState(0);

  const furnishingArray = ["autres"].concat(
    amenitiesByCategory
    .find((item) => item.types.includes(subCategory))?.amenities || []
  );

  const handleAddCharacteristic = () => {
    setCharacteristics([...characteristics, { key: '', value: '' }]);
  };

  const handleCharacteristicChange = (index, field, value) => {
    const newCharacteristics = [...characteristics];
    newCharacteristics[index][field] = value;
    setCharacteristics(newCharacteristics);
  };

  return (
    <Grid container spacing={6}>
      {["Hébergements", "Locaux", "Evénementiels", "Restaurations"].includes(category) && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField 
                fullWidth placeholder='3'
                value={bedroom} onChange={(e) => setBedroom(e.target.value)}
                label={
                  <Typography component="span">
                    Chambres à coucher <Typography component="span" color="error">*</Typography>
                  </Typography>
                  }
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField 
                fullWidth placeholder='12'
                value={livingRoom} onChange={(e) => setLivingRoom(e.target.value)} 
                label={
                  <Typography component="span">
                    Salon <Typography component="span" color="error">*</Typography>
                  </Typography>
                  }
                />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField 
              fullWidth placeholder='4' 
              value={bathroom} onChange={(e) => setBathroom(e.target.value)}
              label={
                <Typography component="span">
                  Salle de bains <Typography component="span" color="error">*</Typography>
                </Typography>
                }
              />
            </Grid>
            {/* <Grid size={{ xs: 12, md: 6 }}>
              <FormControl>
                <FormLabel>Y a-t-il un balcon attaché ?</FormLabel>
                <RadioGroup defaultValue='yes' value={isBalcony} onChange={(e) => setIsBalcony(e.target.value)}>
                  <FormControlLabel value='yes' control={<Radio />} label='Oui' />
                  <FormControlLabel value='no' control={<Radio />} label='Non' />
                </RadioGroup>
              </FormControl> 
            </Grid> */}
            {/* <Grid item xs={12} md={6}>
              <FormControl>
                <FormLabel>Est-ce un immeuble avec étage (R+) ?</FormLabel>
                <RadioGroup value={isfloor} onChange={(e) => setIsFloor(e.target.value)}>
                  <FormControlLabel value='yes' control={<Radio />} label='Oui' />
                  <FormControlLabel value='no' control={<Radio />} label='Non' />
                </RadioGroup>
              </FormControl>
            </Grid> */}
          </>
      )}

      {["Transports"].includes(category) && (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField select fullWidth id='demo-simple-select' defaultValue=''
              value={brand} onChange={(e) => setBrand(e.target.value)}
              label={
                <Typography component="span">
                  Marque du véhicule <Typography component="span" color="error">*</Typography>
                </Typography>
                }
              >
              {subCategory === 'Voitures' && (
                vehicleBrands.cars.map((item, index) => (
                  <MenuItem value={item} key={index}>{item}</MenuItem>
                ))
              )}
              {subCategory === 'Motos' && (
                vehicleBrands.motorcycles.map((item, index) => (
                  <MenuItem value={item} key={index}>{item}</MenuItem>
                ))
              )}
              
              {subCategory === 'Bus' && (
                vehicleBrands.buses.map((item, index) => (
                  <MenuItem value={item} key={index}>{item}</MenuItem>
                ))
              )}

              {subCategory === 'Camions' && (
                vehicleBrands.trucks.map((item, index) => (
                  <MenuItem value={item} key={index}>{item}</MenuItem>
                ))
              )}
            </CustomTextField>
          </Grid>
        {/* Sélection du modèle */}
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select fullWidth id='demo-simple-select' defaultValue=''
              value={model} onChange={(e) => setModel(e.target.value)}
              disabled={!brand} // Désactiver le modèle si aucune marque n'est sélectionnée
              label={
                <Typography component="span">
                  Modèle du véhicule <Typography component="span" color="error">*</Typography>
                </Typography>
                }
            >
              {brand && subCategory === 'Voitures' && (
                vehicleModels.cars[brand] && vehicleModels.cars[brand].map((item, index) => (
                  <MenuItem value={item} key={index}>{item}</MenuItem>
                ))
              )}

              {brand && subCategory === 'Bus' && (
                vehicleModels.buses[brand] && vehicleModels.buses[brand].map((item, index) => (
                  <MenuItem value={item} key={index}>{item}</MenuItem>
                ))
              )}

              {brand && subCategory === 'Camions' && (
                vehicleModels.trucks[brand] && vehicleModels.trucks[brand].map((item, index) => (
                  <MenuItem value={item} key={index}>{item}</MenuItem>
                ))
              )}

              {brand && subCategory === 'Motos' && (
                vehicleModels.motorcycles[brand] && vehicleModels.motorcycles[brand].map((item, index) => (
                  <MenuItem value={item} key={index}>{item}</MenuItem>
                ))
              )}
            </CustomTextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField select fullWidth id='demo-simple-select' 
              defaultValue='Type de carburant'
              value={fuel} onChange={(e) => setFuel(e.target.value)}
              label={
                <Typography component="span">
                  Type de carburant <Typography component="span" color="error">*</Typography>
                </Typography>
                }
              >
                {fuelTypes.map((item, index) => (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField select fullWidth id='demo-simple-select' label='Année' defaultValue='Année'
              value={year} onChange={(e) => setYear(e.target.value)}>
                {years.map((item, index) => (
                  <MenuItem key={index} value={item}>{item}</MenuItem>
                ))}
            </CustomTextField>
          </Grid>
        </>
      )}

      {['Salle de conférence', 'Salle de fête', 'Evénementiels', 'Événementiels'].includes(category) && (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              fullWidth
              type="number"
              placeholder="Nombre de places"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              label={
                <Typography component="span">
                  Nombre de places <Typography component="span" color="error">*</Typography>
                </Typography>
              }
              InputProps={{ inputProps: { min: 0 } }} // Empêche les valeurs négatives
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomAutocomplete
              fullWidth
              multiple
              value={eventType}
              onChange={(event, value) => setEventType(value)} // Évite les valeurs vides
              id="select-furnishing-details"
              options={eventTypes}
              getOptionLabel={(option) => option || ""}
              renderInput={(params) => <CustomTextField {...params} label="Type d'événement" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option} size="small" {...getTagProps({ index })} key={index} />
                ))
              }
            />
          </Grid>
        </>
      )}

      <Grid size={{ xs: 12, md: 6 }}>
        <CustomTextField select fullWidth id='demo-simple-select' label='Etat du bien' defaultValue=''
          value={stateProperty} onChange={(e) => setStateProperty(e.target.value)}>
          <MenuItem value=''>Sélectionner l'état</MenuItem>
          <MenuItem value='new'>Nouveau</MenuItem>
          <MenuItem value='renovated'>Rénové</MenuItem>
          <MenuItem value='old'>Ancien</MenuItem>
        </CustomTextField>
      </Grid>
    
      <Grid size={{ xs: 12}}>
        <CustomAutocomplete
          fullWidth
          multiple
          value={features}
          onChange={(event, value) => setFeatures(value)} // Évite les valeurs vides
          id="select-furnishing-details"
          options={furnishingArray}
          getOptionLabel={(option) => option || ""}
          renderInput={(params) => <CustomTextField {...params} label="Ameublements" />}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} size="small" {...getTagProps({ index })} key={index} />
            ))
          }
        />
        {features.includes('autres') && (
          <CustomTextField
            fullWidth
            label="Détail des autres ameublements ( séparez les par une virgule )"
            value={otherFeatures}
            onChange={(e) => setOtherFeatures(e.target.value)}
            sx={{ mt: 2 }}
          />
        )}
      </Grid>
    {/*   <Grid size={{ xs: 12, md: 6 }}>
        <FormControl>
          <FormLabel>Y a-t-il une zone commune ?</FormLabel>
          <RadioGroup defaultValue='yes'>
            <FormControlLabel value='yes' control={<Radio />} label='Oui' />
            <FormControlLabel value='no' control={<Radio />} label='Non' />
          </RadioGroup>
        </FormControl>
      </Grid> */}
     
      {isfloor === 'yes' && (
         <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label="Nombre d'étage" placeholder='4' 
              value={floor} onChange={(e) => setFloor(e.target.value)}
              />
          </Grid>
      )}
      {characteristics.length > 0 && (
         <Grid size={{ xs: 12 }}>
            <Typography variant="span" className="mbs-4">
              Autres caractéristiques du bien ( Facultatif )
            </Typography>
            {characteristics.map((char, index) => (
              <Grid container spacing={2} key={index} className="mbs-2 flex items-end">
                <Grid size={{ xs: 12, md: 5 }}>
                  <CustomTextField
                    fullWidth
                    value={char.key}
                    onChange={(e) => handleCharacteristicChange(index, 'key', e.target.value)}
                    label={<Typography component="span">
                      Nom de la caractéristique <Typography component="span" color="error">*</Typography>
                    </Typography>}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <CustomTextField
                    fullWidth
                    value={char.value}
                    onChange={(e) => handleCharacteristicChange(index, 'value', e.target.value)}
                    label={<Typography component="span">
                      Valeur <Typography component="span" color="error">*</Typography>
                    </Typography>}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }} className="flex items-center">
                  {index === characteristics.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleAddCharacteristic}
                      className="mie-2"
                    >
                      <i className="tabler-plus" />
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveCharacteristic(index)}
                    >
                      <i className="tabler-trash" />
                    </Button>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
      )}
      <Grid size={{ xs: 12 }}>
        <div className='flex items-center justify-between'>
          <Button
            variant='tonal'
            color='secondary'
            disabled={activeStep === 0}
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
          >
            Précédent
          </Button>
          <Button
            variant='contained'
            color={activeStep === steps.length - 1 ? 'success' : 'primary'}
            onClick={handleNext}
            endIcon={
              activeStep === steps.length - 1 ? (
                <i className='tabler-check' />
              ) : (
                <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
              )
            }
          >
            {activeStep === steps.length - 1 ? 'Enrégistrer' : 'Suivant'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default StepPropertyFeatures
