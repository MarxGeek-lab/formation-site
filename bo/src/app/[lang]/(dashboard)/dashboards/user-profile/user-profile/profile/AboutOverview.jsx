// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Button } from '@mui/material'
import { URL_SITE } from '@/settings'

const renderList = list => {
  return (
    list.length > 0 &&
    list.map((item, index) => {
      return (
        <div key={index} className='flex items-center gap-2'>
          <i className={item.icon} />
          <div className='flex items-center flex-wrap gap-2'>
            <Typography className='font-medium'>
              {`${item.property.charAt(0).toUpperCase() + item.property.slice(1)}:`}
            </Typography>
            <Typography> {item.value.charAt(0).toUpperCase() + item.value.slice(1)}</Typography>
          </div>
        </div>
      )
    })
  )
}

const renderTeams = teams => {
  return (
    teams.length > 0 &&
    teams.map((item, index) => {
      return (
        <div key={index} className='flex items-center flex-wrap gap-2'>
          <Typography className='font-medium'>
            {item.property.charAt(0).toUpperCase() + item.property.slice(1)}
          </Typography>
          <Typography>{item.value.charAt(0).toUpperCase() + item.value.slice(1)}</Typography>
        </div>
      )
    })
  )
}

const AboutOverview = ({ data }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                A propos
              </Typography>
              {data?.about && renderList(data?.about)}

              <div className='flex items-center gap-2'>
                <i className={"tabler-user"} />
                <div className='flex items-center flex-wrap gap-2'>
                  <Typography className='font-medium'>
                  {data?.name}
                  </Typography>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <i className={"tabler-crown"} />
                <div className='flex items-center flex-wrap gap-2'>
                  <Typography className=''>
                    Rôle :
                  </Typography>
                  <Typography className='font-medium'>
                  {data?.role === "agent" ? "Agent": data?.role === "owner" ? "Propriétaire":"Clients"}
                  </Typography>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <i className={"tabler-flag"} />
                <div className='flex items-center flex-wrap gap-2'>
                  <Typography className=''>
                    Pays :
                  </Typography>
                  <Typography className='font-medium'>
                    {data?.country}
                  </Typography>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <i className={"tabler-check"} />
                <div className='flex items-center flex-wrap gap-2'>
                  <Typography className=''>
                    Status :
                  </Typography>
                  <Typography className='font-medium'>
                    {data?.isActive ? "Actif":"Inactif"}
                  </Typography>
                </div>
              </div>
            </div>
            {data?.account === "entreprise" && (
              <div className='flex flex-col gap-4'>
                <Typography className='uppercase' variant='body2' color='text.disabled'>
                  Information entreprise
                </Typography>
                <div className='flex items-center gap-2'>
                  <i className={"tabler-flag"} />
                  <div className='flex items-center flex-wrap gap-2'>
                    <Typography className=''>
                      Nom entreprise :
                    </Typography>
                    <Typography className='font-medium'>
                      {data?.entreprise}
                    </Typography>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <i className={"tabler-flag"} />
                  <div className='flex items-center flex-wrap gap-2'>
                    <Typography className=''>
                      IFU :
                    </Typography>
                    <Typography className='font-medium'>
                      {data?.ifu}
                    </Typography>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <i className={"tabler-flag"} />
                  <div className='flex items-center flex-wrap gap-2'>
                    <Typography className=''>
                      RCCM :
                    </Typography>
                    <Typography className='font-medium'>
                      {data?.rccm}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                Contacts
              </Typography>
              <div className='flex items-center gap-2'>
                <i className={"tabler-phone-call"} />
                <div className='flex items-center flex-wrap gap-2'>
                  <Typography className='font-medium'>
                    {data?.phoneNumber}
                  </Typography>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <i className={"tabler-mail"} />
                <div className='flex items-center flex-wrap gap-2'>
                  <Typography className='font-medium'>
                    {data?.email}
                  </Typography>
                </div>
              </div>
            </div>
           {/*  <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                Teams
              </Typography>
              {data?.teams && renderTeams(data?.teams)}
            </div> */}
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent className='flex flex-col gap-6'>
            <div className='flex flex-col gap-4'>
              <Typography className='uppercase' variant='body2' color='text.disabled'>
                Sécurité
              </Typography>
              <Button variant='contained' color='error' type='submit'
                onClick={() => window.location.href = URL_SITE + '/forgot-password'}>
                Modifier mon mot de passe
              </Button>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default AboutOverview
