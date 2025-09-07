'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartState, CartItem, CartContextType } from '@/types/cart';
import cartApiService from '@/services/cartApi';

const CART_STORAGE_KEY = 'shop1_cart_data';

// Fonction pour charger le panier depuis localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      isOpen: false,
    };
  }

  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Vérifier que les données sont valides
      if (parsedCart && Array.isArray(parsedCart.items)) {
        return {
          ...parsedCart,
          isOpen: false, // Toujours fermer le panier au chargement
          sessionId: parsedCart.sessionId || localStorage.getItem('cart_session_id'),
        };
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du panier:', error);
  }

  return {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isOpen: false,
    sessionId: localStorage.getItem('cart_session_id') || undefined,
  };
};

// Fonction pour sauvegarder le panier dans localStorage
const saveCartToStorage = (cart: CartState) => {
  if (typeof window === 'undefined') return;

  try {
    const cartToSave = {
      ...cart,
      isOpen: false, // Ne pas sauvegarder l'état d'ouverture
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartToSave));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier:', error);
  }
};

const initialState: CartState = loadCartFromStorage();

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SYNC_WITH_BACKEND'; payload: CartState }
  | { type: 'SET_LOADING'; payload: boolean };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price,
        };
      }
      
      const newItem: CartItem = { ...action.payload, quantity: 1 };
      
      return {
        ...state,
        items: [...state.items, newItem],
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + action.payload.price,
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (!itemToRemove) return state;
      
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: id });
      }
      
      const item = state.items.find(item => item.id === id);
      if (!item) return state;
      
      const quantityDiff = quantity - item.quantity;
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalPrice: state.totalPrice + (item.price * quantityDiff),
      };
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        isOpen: false,
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case 'SYNC_WITH_BACKEND':
      return {
        ...state,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalPrice: action.payload.totalPrice,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Synchroniser avec le backend au chargement
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // S'assurer qu'on a un sessionId
        if (!cart.sessionId) {
          const sessionId = cartApiService.generateSessionId();
          dispatch({ 
            type: 'SYNC_WITH_BACKEND', 
            payload: { 
              ...cart,
              sessionId 
            } 
          });
        }
        
        // Récupérer le panier depuis le backend
        const backendCart = await cartApiService.getCart();
        
        if (backendCart) {
          // Synchroniser avec le panier backend
          const frontendData = cartApiService.convertToFrontendFormat(backendCart);
          dispatch({ 
            type: 'SYNC_WITH_BACKEND', 
            payload: frontendData
          });
        } else if (cart.items.length > 0) {
          // Si pas de panier backend mais des items locaux, synchroniser vers le backend
          await cartApiService.syncCart(cart.items);
        }
      } catch (error) {
        console.error('Erreur synchronisation panier:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    syncWithBackend();
  }, []); // Seulement au montage du composant

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Ajouter localement d'abord pour une réponse rapide
      dispatch({ type: 'ADD_TO_CART', payload: item });
      
      // Puis synchroniser avec le backend
      const backendCart = await cartApiService.addToCart(item);
      if (backendCart) {
        const frontendData = cartApiService.convertToFrontendFormat(backendCart);
        dispatch({ 
          type: 'SYNC_WITH_BACKEND', 
          payload: frontendData 
        });
      }
    } catch (error) {
      console.error('Erreur ajout au panier:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Supprimer localement d'abord
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
      
      // Puis synchroniser avec le backend
      const backendCart = await cartApiService.removeFromCart(id);
      if (backendCart) {
        const frontendData = cartApiService.convertToFrontendFormat(backendCart);
        dispatch({ 
          type: 'SYNC_WITH_BACKEND', 
          payload: frontendData 
        });
      }
    } catch (error) {
      console.error('Erreur suppression du panier:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Mettre à jour localement d'abord
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      
      // Puis synchroniser avec le backend
      const backendCart = await cartApiService.updateQuantity(id, quantity);
      if (backendCart) {
        const frontendData = cartApiService.convertToFrontendFormat(backendCart);
        dispatch({ 
          type: 'SYNC_WITH_BACKEND', 
          payload: frontendData 
        });
      }
    } catch (error) {
      console.error('Erreur mise à jour quantité:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Vider localement d'abord
      dispatch({ type: 'CLEAR_CART' });
      
      // Puis synchroniser avec le backend
      await cartApiService.clearCart();
    } catch (error) {
      console.error('Erreur vidage panier:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  // Fonction pour marquer le panier comme converti (à utiliser après une commande)
  const convertCart = async (orderId: string, email?: string) => {
    try {
      await cartApiService.convertCart(orderId, email);
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Erreur conversion panier:', error);
    }
  };

  // Fonction pour associer le panier à un utilisateur connecté
  const associateWithUser = async () => {
    try {
      const backendCart = await cartApiService.associateWithUser();
      if (backendCart) {
        const frontendData = cartApiService.convertToFrontendFormat(backendCart);
        dispatch({ 
          type: 'SYNC_WITH_BACKEND', 
          payload: frontendData 
        });
      }
    } catch (error) {
      console.error('Erreur association utilisateur:', error);
    }
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    convertCart,
    associateWithUser,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
