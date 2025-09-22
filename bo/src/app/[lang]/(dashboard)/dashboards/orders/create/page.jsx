'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Autocomplete from '@mui/material/Autocomplete'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import InputAdornment from '@mui/material/InputAdornment'

// Context Imports
import { useAuthStore, useProductStore, useUserStore, useSubscriptionContext, useAdminStore, useCustomerStore, usePropertyStore } from '@/contexts/GlobalContext'
import api from '@/configs/api'

// API Imports

const CreateOrder = () => {
  const { user } = useAuthStore()
  const { products, fetchProducts } = useProductStore()
    const { getAllProducts, allProducts } = usePropertyStore();
  const { users, fetchUsers } = useUserStore()
  const { subscriptionPlans, fetchSubscription } = useSubscriptionContext() 

  // Form State
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [orderType, setOrderType] = useState('achat')
  const [note, setNote] = useState('')
  const [autoConfirm, setAutoConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [productSearch, setProductSearch] = useState('')

  const { getCustomersByOwner } = useCustomerStore();
    const [ customers, setCustomers ] = useState([]);

    const fetchCustomers = async () => {
        if (user) {
            try {
            const { data } = await getCustomersByOwner();
            setCustomers(data)
            } catch (error) {
            console.log(error);
            }
        }
    }
  
  useEffect(() => {
    if (user) {
      fetchProducts()
      fetchUsers()
      fetchSubscription()
      fetchCustomers()
      getAllProducts();
    }
  }, [user])

//   const CreateOrder = () => {
//     const { user } = useAuthStore()
//     const { products, fetchProducts } = useProductStore()
//     const { users, fetchUsers } = useUserStore()
//     const { subscriptionPlans, fetchSubscription } = useSubscriptionContext()
    
//     // Form State
//     const [selectedUser, setSelectedUser] = useState(null)
//     const [selectedItems, setSelectedItems] = useState([])
//     const [orderType, setOrderType] = useState('achat')
//     const [note, setNote] = useState('')
//     const [autoConfirm, setAutoConfirm] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState('')
//     const [success, setSuccess] = useState('')
    
//     useEffect(() => {
//       if (user) {
//         fetchProducts()
//         fetchUsers()
//         fetchSubscription()
//       }
//     }, [user])
  
    const handleAddProduct = (product) => {
      const existingItem = selectedItems.find(item => item.id === product._id && item.type === 'achat')
      if (existingItem) {
        setSelectedItems(prev => 
          prev.map(item => 
            item.id === product._id && item.type === 'achat'
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        )
      } else {
        setSelectedItems(prev => [...prev, {
          id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          type: 'achat',
          category: product.category
        }])
      }
    }
  
    const handleAddSubscription = (subscription) => {
      const existingItem = selectedItems.find(item => item.id === subscription._id && item.type === 'abonnement')
      if (!existingItem) {
        setSelectedItems(prev => [...prev, {
          id: subscription._id,
          name: subscription.title,
          price: subscription.price,
          quantity: 1,
          type: 'abonnement',
          subscription: subscription
        }])
      }
    }

    const handleRemoveItem = (itemId, type) => {
      setSelectedItems(prev => prev.filter(item => !(item.id === itemId && item.type === type)))
    }

        const handleQuantityChange = (itemId, type, newQuantity) => {
      if (newQuantity <= 0) {
        handleRemoveItem(itemId, type)
        return
      }
      setSelectedItems(prev => 
      prev.map(item => 
        item.id === itemId && item.type === type
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!selectedUser) {
        throw new Error('Veuillez sélectionner un utilisateur')
      }
      if (selectedItems.length === 0) {
        throw new Error('Veuillez ajouter au moins un produit ou abonnement')
      }

      // Prepare items for API
      const items = selectedItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        type: item.type,
        subscription: item.subscription || undefined
      }))

      const orderData = {
        userId: selectedUser._id,
        items,
        note,
        typeOrder: orderType,
        autoConfirm
      }

      const response = await api.post('/orders/admin/create', orderData)
      
      if (response.data.success) {
        setSuccess(`Commande ${autoConfirm ? 'créée et confirmée' : 'créée'} avec succès! ID: ORD-${response.data.order._id}`)
        // Reset form
        setSelectedUser(null)
        setSelectedItems([])
        setNote('')
        setAutoConfirm(false)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de la création de la commande')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = allProducts?.filter(product => {
    if (user?.role === 'super_admin') return true
    return product.assignedAdminId === user?._id
  })?.filter(product => 
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  )

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4' className='mb-2'>
          Créer une Commande Admin
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Créez une commande directement attribuée à un utilisateur
        </Typography>
      </Grid>

      {error && (
        <Grid size={{ xs: 12 }}>
          <Alert severity='error'>{error}</Alert>
        </Grid>
      )}

      {success && (
        <Grid size={{ xs: 12 }}>
          <Alert severity='success'>{success}</Alert>
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardHeader title='Détails de la Commande' />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {/* User Selection */}
                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    options={customers || []}
                    getOptionLabel={(option) => `${option.name} (${option.email})`}
                    value={selectedUser}
                    onChange={(event, newValue) => setSelectedUser(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sélectionner l'utilisateur"
                        required
                        fullWidth
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <ListItemAvatar>
                          <Avatar src={option.avatar} alt={option.name}>
                            {option.name?.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={option.name}
                          secondary={option.email}
                        />
                      </Box>
                    )}
                  />
                </Grid>

                {/* Order Type */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Type de Commande</InputLabel>
                    <Select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      label="Type de Commande"
                    >
                      <MenuItem value="achat">Achat</MenuItem>
                      <MenuItem value="abonnement">Abonnement</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Auto Confirm */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={autoConfirm}
                        onChange={(e) => setAutoConfirm(e.target.checked)}
                      />
                    }
                    label="Auto-confirmer la commande"
                  />
                </Grid>

                {/* Note */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Note (optionnel)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ajouter une note pour cette commande..."
                  />
                </Grid>

                {/* Submit Button */}
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || !selectedUser || selectedItems.length === 0}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    {loading ? 'Création...' : autoConfirm ? 'Créer et Confirmer' : 'Créer la Commande'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
        {/* Selected Items */}
        <Card>
          <CardHeader title={`Panier (${selectedItems.length})`} />
          <CardContent>
            {selectedItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucun élément sélectionné
              </Typography>
            ) : (
              <>
                <Grid container spacing={2}>
                  {selectedItems.map((item, index) => (
                    <Grid size={{ xs: 12 }} key={`${item.id}-${item.type}-${index}`}>
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center"
                        p={2}
                        bgcolor="action.hover"
                        borderRadius={1}
                      >
                        <Box flex={1}>
                          <Typography variant="subtitle2">{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.price.toLocaleString()} XOF
                          </Typography>
                          <Chip 
                            label={item.type} 
                            size="small" 
                            color={item.type === 'abonnement' ? 'primary' : 'default'}
                          />
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          {item.type !== 'abonnement' && (
                            <TextField
                              size="small"
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, item.type, parseInt(e.target.value))}
                              inputProps={{ min: 1, style: { width: '60px' } }}
                            />
                          )}
                          <Button
                            size="large"
                            color="error"
                            onClick={() => handleRemoveItem(item.id, item.type)}
                          >
                            &times;
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Box mt={3} pt={2} borderTop={1} borderColor="divider">
                  <Typography variant="h6" align="right">
                    Total: {calculateTotal().toLocaleString()} XOF
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        {/* Products Selection */}
        <Card className='mb-6'>
          <CardHeader title='Ajouter des Produits' />
          <CardContent>
            {/* Search Field */}
            <TextField
              fullWidth
              placeholder="Rechercher un produit..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className='ri-search-line' />
                  </InputAdornment>
                ),
              }}
            />
            
            <Grid container spacing={2}
            sx={{
                maxHeight: '300px',
                overflowY: 'auto',
            }}>
              {filteredProducts?.map((product) => (
                <Grid size={{ xs: 12 }} key={product._id}>
                  <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center"
                    p={2}
                    border={1}
                    borderColor="divider"
                    borderRadius={1}
                  >
                    <Box>
                      <Typography variant="subtitle2">{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product?.price?.toLocaleString()} XOF
                      </Typography>
                      <Chip 
                        label={product.category} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleAddProduct(product)}
                    >
                      Ajouter
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* subscriptionPlans Selection */}
        <Card className='mb-6'>
          <CardHeader title='Ajouter des Abonnements' />
          <CardContent>
            <Grid container spacing={2}>
              {subscriptionPlans.map((subscription) => (
                <Grid size={{ xs: 12 }} key={subscription._id}>
                  <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center"
                    p={2}
                    border={1}
                    borderColor="divider"
                    borderRadius={1}
                  >
                    <Box>
                      <Typography variant="subtitle2">{subscription.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {subscription.price.toLocaleString()} XOF - {subscription.duration} jours
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleAddSubscription(subscription)}
                    >
                      Ajouter
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        
      </Grid>
    </Grid>
  )
}

export default CreateOrder
