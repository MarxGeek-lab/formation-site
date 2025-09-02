'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartState, CartItem, CartContextType } from '@/types/cart';

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
  | { type: 'TOGGLE_CART' };

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
      return initialState;
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
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

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
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
