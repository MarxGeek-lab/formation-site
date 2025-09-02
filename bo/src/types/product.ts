export interface Product {
  id: string | number;
  name: string;
  price: number | string;
  image: string;
  category?: string;
}

export interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge: string;
  badgeColor: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  category: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}
