import { API_URL } from '@/settings/constant';
import { CartItem } from '@/types/cart';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_URL || 'http://localhost:5000/api';

// Générer un sessionId unique pour les utilisateurs non connectés
export const generateSessionId = (): string => {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  }
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Interface pour les réponses API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface BackendCartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  options?: Record<string, string>;
}

interface BackendCart {
  _id: string;
  userId?: string;
  email?: string;
  sessionId: string;
  items: BackendCartItem[];
  totalItems: number;
  totalPrice: number;
  status: 'active' | 'abandoned' | 'converted';
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
}

// Convertir les items backend vers frontend
const convertBackendItemToFrontend = (backendItem: BackendCartItem): CartItem => ({
  id: backendItem.productId,
  name: backendItem.name,
  price: backendItem.price,
  quantity: backendItem.quantity,
  image: backendItem.image,
  category: backendItem.category,
});

// Convertir les items frontend vers backend
const convertFrontendItemToBackend = (frontendItem: Omit<CartItem, 'quantity'>, quantity: number = 1) => ({
  productId: frontendItem.id,
  name: frontendItem.name,
  price: frontendItem.price,
  quantity,
  image: frontendItem.image,
  category: frontendItem.category,
});

class CartApiService {
  private sessionId: string;
  private authToken: string | null = null;

  constructor() {
    this.sessionId = generateSessionId();
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('auth_token');
    }
  }

  // Générer un nouveau sessionId
  generateSessionId(): string {
    return generateSessionId();
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Récupérer le token le plus récent à chaque appel
    const currentToken = this.getCurrentToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    return headers;
  }

  // Méthode pour récupérer le token actuel depuis le localStorage/sessionStorage
  private getCurrentToken(): string | null {
    if (typeof window !== 'undefined') {
      // Vérifier d'abord localStorage, puis sessionStorage, puis les cookies
      let token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      
      if (!token) {
        // Essayer de récupérer depuis les cookies
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => 
          cookie.trim().startsWith('accessToken=')
        );
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }
      
      return token;
    }
    return this.authToken;
  }

  // Créer ou récupérer un panier
  async createOrGetCart(email?: string): Promise<BackendCart | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          sessionId: this.sessionId,
          email,
        }),
      });

      const result: ApiResponse<BackendCart> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      console.error('Erreur création panier:', result.message);
      return null;
    } catch (error) {
      console.error('Erreur API création panier:', error);
      return null;
    }
  }

  // Récupérer le panier existant
  async getCart(): Promise<BackendCart | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart?sessionId=${this.sessionId}`, {
        headers: this.getHeaders(),
      });

      const result: ApiResponse<BackendCart> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur API récupération panier:', error);
      return null;
    }
  }

  // Ajouter un produit au panier
  async addToCart(item: Omit<CartItem, 'quantity'>, email?: string): Promise<BackendCart | null> {
    try {
      const backendItem = convertFrontendItemToBackend(item, 1);
      
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          sessionId: this.sessionId,
          ...backendItem,
          email,
        }),
      });

      const result: ApiResponse<BackendCart> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      console.error('Erreur ajout au panier:', result.message);
      return null;
    } catch (error) {
      console.error('Erreur API ajout panier:', error);
      return null;
    }
  }

  // Supprimer un produit du panier
  async removeFromCart(productId: string): Promise<BackendCart | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${productId}?sessionId=${this.sessionId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const result: ApiResponse<BackendCart> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      console.error('Erreur suppression du panier:', result.message);
      return null;
    } catch (error) {
      console.error('Erreur API suppression panier:', error);
      return null;
    }
  }

  // Mettre à jour la quantité d'un produit
  async updateQuantity(productId: string, quantity: number): Promise<BackendCart | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          sessionId: this.sessionId,
          quantity,
        }),
      });

      const result: ApiResponse<BackendCart> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      console.error('Erreur mise à jour quantité:', result.message);
      return null;
    } catch (error) {
      console.error('Erreur API mise à jour quantité:', error);
      return null;
    }
  }

  // Vider le panier
  async clearCart(): Promise<BackendCart | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify({
          sessionId: this.sessionId,
        }),
      });

      const result: ApiResponse<BackendCart> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      console.error('Erreur vidage panier:', result.message);
      return null;
    } catch (error) {
      console.error('Erreur API vidage panier:', error);
      return null;
    }
  }

  // Marquer le panier comme converti (après commande)
  async convertCart(orderId: string, email?: string): Promise<BackendCart | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/convert`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          sessionId: this.sessionId,
          orderId,
          email,
        }),
      });

      const result: ApiResponse<BackendCart> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      console.error('Erreur conversion panier:', result.message);
      return null;
    } catch (error) {
      console.error('Erreur API conversion panier:', error);
      return null;
    }
  }

  // Associer le panier à un utilisateur connecté
  async associateWithUser(): Promise<BackendCart | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/associate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          sessionId: this.sessionId,
        }),
      });

      const result: ApiResponse<BackendCart> = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      console.error('Erreur association panier:', result.message);
      return null;
    } catch (error) {
      console.error('Erreur API association panier:', error);
      return null;
    }
  }

  // Synchroniser le panier local avec le backend
  async syncCart(localItems: CartItem[]): Promise<BackendCart | null> {
    try {
      // D'abord récupérer le panier backend
      let backendCart = await this.getCart();
      
      if (!backendCart) {
        // Créer un nouveau panier si inexistant
        backendCart = await this.createOrGetCart();
        if (!backendCart) return null;
      }

      // Si le panier local a des items que le backend n'a pas, les ajouter
      for (const localItem of localItems) {
        const existsInBackend = backendCart.items.some(
          backendItem => backendItem.productId === localItem.id
        );

        if (!existsInBackend) {
          backendCart = await this.addToCart({
            id: localItem.id,
            name: localItem.name,
            price: localItem.price,
            image: localItem.image,
            category: localItem.category,
          });
          if (!backendCart) return null;

          // Mettre à jour la quantité si différente de 1
          if (localItem.quantity > 1) {
            backendCart = await this.updateQuantity(localItem.id, localItem.quantity);
            if (!backendCart) return null;
          }
        } else {
          // Vérifier si la quantité est différente
          const backendItem = backendCart.items.find(
            item => item.productId === localItem.id
          );
          if (backendItem && backendItem.quantity !== localItem.quantity) {
            backendCart = await this.updateQuantity(localItem.id, localItem.quantity);
            if (!backendCart) return null;
          }
        }
      }

      return backendCart;
    } catch (error) {
      console.error('Erreur synchronisation panier:', error);
      return null;
    }
  }

  // Convertir un panier backend vers le format frontend
  convertToFrontendFormat(backendCart: BackendCart): {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    sessionId: string;
    isOpen: boolean;
  } {
    return {
      items: backendCart.items.map(convertBackendItemToFrontend),
      totalItems: backendCart.totalItems,
      totalPrice: backendCart.totalPrice,
      sessionId: backendCart.sessionId,
      isOpen: false,
    };
  }

  // Mettre à jour le token d'authentification
  setAuthToken(token: string | null) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }
}

// Instance singleton
export const cartApiService = new CartApiService();

export default cartApiService;
