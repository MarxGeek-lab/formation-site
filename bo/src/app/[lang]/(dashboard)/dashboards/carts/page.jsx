'use client';

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

// API Imports
import api from '@/configs/api'

const CartsPage = () => {
  // States
  const [carts, setCarts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCart, setSelectedCart] = useState(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [reminderConfig, setReminderConfig] = useState({
    type: 'email',
    delay: 24,
    message: ''
  })

  // Fetch carts data
  const fetchCarts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/cart/admin/list')
      setCarts(response.data.data || [])
    } catch (error) {
      console.error('Erreur lors de la récupération des paniers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCarts()
  }, [])

  // Handle cart status update
  const updateCartStatus = async (cartId, status) => {
    try {
      await api.put(`/cart/admin/${cartId}/status`, { status })
      fetchCarts() // Refresh data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
    }
  }

  // Handle reminder setup
  const setupReminder = async () => {
    try {
      await api.post(`/cart/admin/${selectedCart._id}/reminder`, reminderConfig)
      setShowReminderDialog(false)
      setReminderConfig({ type: 'email', delay: 24, message: '' })
      fetchCarts() // Refresh data
    } catch (error) {
      console.error('Erreur lors de la configuration de la relance:', error)
    }
  }

  // Format price
  const formatPrice = (price) => {
    return `${price.toLocaleString('fr-FR')} FCFA`
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'primary'
      case 'abandoned': return 'warning'
      case 'converted': return 'success'
      default: return 'default'
    }
  }

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif'
      case 'abandoned': return 'Abandonné'
      case 'converted': return 'Converti'
      default: return status
    }
  }

  return (
    <Grid container spacing={6}>
      {/* Header */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader 
            title="Gestion des Paniers"
            subheader="Gérez les paniers abandonnés et configurez les relances automatiques"
          />
        </Card>
      </Grid>

      {/* Statistics Cards */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="primary">
              {carts.filter(cart => cart.status === 'active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paniers Actifs
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="warning.main">
              {carts.filter(cart => cart.status === 'abandoned').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paniers Abandonnés
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="success.main">
              {carts.filter(cart => cart.status === 'converted').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paniers Convertis
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="info.main">
              {formatPrice(carts.reduce((total, cart) => total + (cart.totalPrice || 0), 0))}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Valeur Totale
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Carts Table */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title="Liste des Paniers" />
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Session</TableCell>
                    <TableCell>Utilisateur</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Articles</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Dernière Activité</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : carts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Aucun panier trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    carts.map((cart) => (
                      <TableRow key={cart._id}>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {cart.sessionId?.substring(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {cart.userId ? (
                            <Typography variant="body2">
                              {cart.userId.firstName} {cart.userId.lastName}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Anonyme
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {cart.email || 'Non renseigné'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {cart.totalItems} article(s)
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatPrice(cart.totalPrice)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(cart.status)}
                            color={getStatusColor(cart.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(cart.lastActivity)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedCart(cart)
                                setShowDetailsDialog(true)
                              }}
                              title="Voir les détails"
                            >
                              <i className="tabler-eye" />
                            </IconButton>
                            
                            {cart.status === 'abandoned' && (
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={() => {
                                  setSelectedCart(cart)
                                  setShowReminderDialog(true)
                                }}
                                title="Configurer une relance"
                              >
                                <i className="tabler-mail" />
                              </IconButton>
                            )}
                            
                            {cart.status === 'active' && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => updateCartStatus(cart._id, 'abandoned')}
                                title="Marquer comme abandonné"
                              >
                                <i className="tabler-x" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Cart Details Dialog */}
      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Détails du Panier</DialogTitle>
        <DialogContent>
          {selectedCart && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Informations Générales
              </Typography>
              <Typography><strong>Session ID:</strong> {selectedCart.sessionId}</Typography>
              <Typography><strong>Email:</strong> {selectedCart.email || 'Non renseigné'}</Typography>
              <Typography><strong>Statut:</strong> {getStatusLabel(selectedCart.status)}</Typography>
              <Typography><strong>Total:</strong> {formatPrice(selectedCart.totalPrice)}</Typography>
              <Typography><strong>Créé le:</strong> {formatDate(selectedCart.createdAt)}</Typography>
              <Typography><strong>Dernière activité:</strong> {formatDate(selectedCart.lastActivity)}</Typography>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Articles ({selectedCart.totalItems})
              </Typography>
              {selectedCart.items?.map((item, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography><strong>{item.name}</strong></Typography>
                  <Typography>Quantité: {item.quantity}</Typography>
                  <Typography>Prix: {formatPrice(item.price)}</Typography>
                  {item.options && Object.keys(item.options).length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">Options:</Typography>
                      {Object.entries(item.options).map(([key, value]) => (
                        <Typography key={key} variant="body2">
                          • {key}: {Array.isArray(value) ? value.join(', ') : value}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reminder Configuration Dialog */}
      <Dialog
        open={showReminderDialog}
        onClose={() => setShowReminderDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Configurer une Relance</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Type de Relance</InputLabel>
              <Select
                value={reminderConfig.type}
                onChange={(e) => setReminderConfig({ ...reminderConfig, type: e.target.value })}
                label="Type de Relance"
              >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="notification">Notification Push</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Délai (heures)"
              value={reminderConfig.delay}
              onChange={(e) => setReminderConfig({ ...reminderConfig, delay: parseInt(e.target.value) })}
              helperText="Délai avant l'envoi de la relance"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message personnalisé"
              value={reminderConfig.message}
              onChange={(e) => setReminderConfig({ ...reminderConfig, message: e.target.value })}
              helperText="Message optionnel à inclure dans la relance"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReminderDialog(false)}>
            Annuler
          </Button>
          <Button onClick={setupReminder} variant="contained">
            Configurer la Relance
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CartsPage
