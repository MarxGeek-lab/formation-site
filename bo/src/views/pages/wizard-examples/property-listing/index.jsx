'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stepper from '@mui/material/Stepper'
import MuiStep from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import StepPhotos from './StepImages'
import StepPropertyDetails from './StepPropertyDetails'
import StepPropertyFeatures from './StepPropertyFeatures'
import StepPropertyArea from './StepPropertyArea'
import StepPriceDetails from './StepPriceDetails'

// Styled Component Imports
import StepperWrapper from '@core/styles/stepper'

// Vars
const steps = [
/*   {
    icon: 'tabler-users',
    title: 'Personal Details',
    subtitle: 'Your Name/Email'
  }, */
  {
    icon: 'tabler-home',
    title: 'Détails de la propriété',
    subtitle: 'tous les images'
  },
  {
    icon: 'tabler-bookmarks',
    title: 'Photos de la propriété',
    subtitle: 'Chambres ...etc'
  },
  {
    icon: 'tabler-bookmarks',
    title: 'Caractéristiques du bien',
    subtitle: 'Chambres ...etc'
  },
/*   {
    icon: 'tabler-map-pin',
    title: 'Property Area',
    subtitle: 'Covered Area'
  }, */
  {
    icon: 'tabler-currency-dollar',
    title: 'Details sur le prix',
    subtitle: 'prix'
  }
]

const Step = styled(MuiStep)({
  '&.Mui-completed .step-title , &.Mui-completed .step-subtitle': {
    color: 'var(--mui-palette-text-disabled)'
  }
})

const getStepContent = (step, handleNext, handlePrev) => {
  const Tag =
    step === 0
      ? StepPropertyDetails
      : step === 1
        ? StepPhotos
        : step === 2
          ? StepPropertyFeatures
          : step === 3
            ? StepPriceDetails
            : StepPriceDetails

  return <Tag activeStep={step} handleNext={handleNext} handlePrev={handlePrev} steps={steps} />
}

const PropertyListingWizard = () => {
  // States
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    if (activeStep !== steps.length - 1) {
      setActiveStep(activeStep + 1)
    } else {
      alert('Submitted..!!')
    }
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  return (
    <Card className='flex flex-col lg:flex-row'>
      <CardContent className='max-lg:border-be lg:border-ie lg:min-is-[300px]'>
        <StepperWrapper>
          <Stepper
            activeStep={activeStep}
            orientation='vertical'
            connector={<></>}
            className='flex flex-col gap-4 min-is-[220px]'
          >
            {steps.map((label, index) => {
              return (
                <Step key={index} onClick={() => setActiveStep(index)}>
                  <StepLabel icon={<></>} className='p-1 cursor-pointer'>
                    <div className='step-label'>
                      <CustomAvatar
                        variant='rounded'
                        skin={activeStep === index ? 'filled' : 'light'}
                        {...(activeStep >= index && { color: 'primary' })}
                        {...(activeStep === index && { className: 'shadow-primarySm' })}
                        size={38}
                      >
                        <i className={classnames(label.icon, '!text-[22px]')} />
                      </CustomAvatar>
                      <div className='flex flex-col'>
                        <Typography color='text.primary' className='step-title'>
                          {label.title}
                        </Typography>
                        <Typography className='step-subtitle'>{label.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <CardContent className='flex-1 pbs-6'>{getStepContent(activeStep, handleNext, handlePrev)}</CardContent>
    </Card>
  )
}

export default PropertyListingWizard
