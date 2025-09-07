'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'

// API Imports
import api from '@/configs/api'

const CartRemindersTab = () => {
  // States
  const [settings, setSettings] = useState({
    cartReminderSettings: {
      firstReminderDelay: 24,
      secondReminderDelay: 72,
      thirdReminderDelay: 168,
      enableEmailReminders: true,
      enableSmsReminders: false,
      enablePushNotifications: false,
      abandonmentThreshold: 24,
      defaultEmailSubject: 'Votre panier vous attend - Finalisez votre commande !',
      defaultEmailMessage: 'Vous avez laissé des articles dans votre panier. Finalisez votre commande maintenant pour ne pas les perdre !',
      defaultSmsMessage: 'Votre panier vous attend ! Finalisez votre commande sur {site_url}',
      maxRemindersPerCart: 3,
      minCartValue: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/settings')
      if (response.data.success && response.data.data) {
        setSettings(response.data.data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error)
      setError('Erreur lors de la récupération des paramètres')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      cartReminderSettings: {
        ...prev.cartReminderSettings,
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      const response = await api.put('/settings', settings)
      
      if (response.data.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setError('Erreur lors de la sauvegarde des paramètres')
    } finally {
      setSaving(false)
    }
  }

  const convertHoursToText = (hours) => {
    if (hours < 24) {
      return `${hours} heure${hours > 1 ? 's' : ''}`
    } else {
      const days = Math.floor(hours / 24)
      return `${days} jour${days > 1 ? 's' : ''}`
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Chargement des paramètres...</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Alerts */}
      {success && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="success">
            Paramètres sauvegardés avec succès !
          </Alert>
        </Grid>
      )}
      
      {error && (
        <Grid size={{ xs: 12 }}>
          <Alert severity="error">
            {error}
          </Alert>
        </Grid>
      )}

      {/* Délais de relance */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader 
            title="Délais de Relance"
            subheader="Configurez les délais d'envoi des relances pour paniers abandonnés"
          />
          <CardContent>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Seuil d'abandon (heures)"
                  value={settings.cartReminderSettings.abandonmentThreshold}
                  onChange={(e) => handleInputChange('abandonmentThreshold', parseInt(e.target.value))}
                  helperText="Délai d'inactivité avant de marquer un panier comme abandonné"
                  inputProps={{ min: 1, max: 168 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="1ère relance (heures)"
                  value={settings.cartReminderSettings.firstReminderDelay}
                  onChange={(e) => handleInputChange('firstReminderDelay', parseInt(e.target.value))}
                  helperText={`Soit ${convertHoursToText(settings.cartReminderSettings.firstReminderDelay)} après abandon`}
                  inputProps={{ min: 1, max: 168 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="2ème relance (heures)"
                  value={settings.cartReminderSettings.secondReminderDelay}
                  onChange={(e) => handleInputChange('secondReminderDelay', parseInt(e.target.value))}
                  helperText={`Soit ${convertHoursToText(settings.cartReminderSettings.secondReminderDelay)} après abandon`}
                  inputProps={{ min: 1, max: 336 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="3ème relance (heures)"
                  value={settings.cartReminderSettings.thirdReminderDelay}
                  onChange={(e) => handleInputChange('thirdReminderDelay', parseInt(e.target.value))}
                  helperText={`Soit ${convertHoursToText(settings.cartReminderSettings.thirdReminderDelay)} après abandon`}
                  inputProps={{ min: 1, max: 720 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Nombre max de relances"
                  value={settings.cartReminderSettings.maxRemindersPerCart}
                  onChange={(e) => handleInputChange('maxRemindersPerCart', parseInt(e.target.value))}
                  helperText="Maximum de relances par panier"
                  inputProps={{ min: 1, max: 10 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Valeur minimale (FCFA)"
                  value={settings.cartReminderSettings.minCartValue}
                  onChange={(e) => handleInputChange('minCartValue', parseInt(e.target.value))}
                  helperText="Valeur minimale du panier pour déclencher une relance"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Types de relance */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader 
            title="Types de Relance"
            subheader="Activez ou désactivez les différents canaux de relance"
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.cartReminderSettings.enableEmailReminders}
                      onChange={(e) => handleInputChange('enableEmailReminders', e.target.checked)}
                    />
                  }
                  label="Relances par Email"
                />
                <Typography variant="body2" color="text.secondary">
                  Envoyer des relances par email aux clients
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.cartReminderSettings.enableSmsReminders}
                      onChange={(e) => handleInputChange('enableSmsReminders', e.target.checked)}
                    />
                  }
                  label="Relances par SMS"
                />
                <Typography variant="body2" color="text.secondary">
                  Envoyer des relances par SMS (nécessite configuration SMS)
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.cartReminderSettings.enablePushNotifications}
                      onChange={(e) => handleInputChange('enablePushNotifications', e.target.checked)}
                    />
                  }
                  label="Notifications Push"
                />
                <Typography variant="body2" color="text.secondary">
                  Envoyer des notifications push (nécessite configuration push)
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Messages par défaut */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader 
            title="Messages par Défaut"
            subheader="Configurez les messages par défaut pour chaque type de relance"
          />
          <CardContent>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Sujet Email par défaut"
                  value={settings.cartReminderSettings.defaultEmailSubject}
                  onChange={(e) => handleInputChange('defaultEmailSubject', e.target.value)}
                  helperText="Sujet par défaut pour les emails de relance"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message Email par défaut"
                  value={settings.cartReminderSettings.defaultEmailMessage}
                  onChange={(e) => handleInputChange('defaultEmailMessage', e.target.value)}
                  helperText="Message par défaut pour les emails de relance"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Message SMS par défaut"
                  value={settings.cartReminderSettings.defaultSmsMessage}
                  onChange={(e) => handleInputChange('defaultSmsMessage', e.target.value)}
                  helperText="Message par défaut pour les SMS de relance. Utilisez {site_url} pour l'URL du site"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Actions */}
      <Grid size={{ xs: 12 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={fetchSettings}
            disabled={saving}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default CartRemindersTab
