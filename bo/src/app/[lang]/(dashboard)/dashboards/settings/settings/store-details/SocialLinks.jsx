// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useRef, useState } from 'react'

const SocialLinks = ({
 facebookUrl, setFacebookUrl,
 twitterUrl, setTwitterUrl, instagramUrl, setInstagramUrl,
 linkedinUrl, setLinkedinUrl, youtubeUrl, setYoutubeUrl,
}) => {

  return (
    <Card>
      <Typography variant="h5" fontWeight={600} className="mx-6 mt-4">
        Informations reseaux sociaux
      </Typography>
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Facebook url ( https://... ) ' 
              placeholder='https://...' 
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Twitter url ( https://... )' 
              placeholder='https://...' 
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Instagram url ( https://... )' 
              placeholder='https://...'
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)} 
              />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Linkedin url ( https://... )' 
              placeholder='https://...' 
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField 
              fullWidth label='Youtube url ( https://... )' 
              placeholder='https://...' 
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SocialLinks
