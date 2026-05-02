export interface User {
  id: string;
  nickname: string;
  avatar_url?: string;
  email?: string;
  role: 'user' | 'merchant' | 'admin';
  preferences?: Record<string, any>;
}

export interface City {
  id: string;
  name_cn: string;
  name_en: string;
  slug: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  total_shops?: number;
  avg_rating?: number;
}

export interface District {
  id: string;
  name: string;
  slug: string;
  latitude?: number;
  longitude?: number;
}

export interface CoffeeShop {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  avg_price?: number;
  rating: number;
  review_count: number;
  favorite_count: number;
  checkin_count: number;
  status: 'draft' | 'pending' | 'active' | 'rejected' | 'closed';
  is_verified: boolean;
  opening_hours: Record<string, string>;
  features: string[];
  cover_image_url?: string;
  popularity_score: number;
  city?: City;
  district?: District;
  photos?: ShopPhoto[];
  menu_items?: MenuItem[];
}

export interface ShopPhoto {
  id: string;
  url: string;
  caption?: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  flavor_tags: string[];
  is_signature: boolean;
  coffee_type?: CoffeeType;
}

export interface CoffeeType {
  id: string;
  name_cn: string;
  name_en: string;
  slug: string;
  category: string;
  short_description?: string;
  description?: string;
  flavor_tags: string[];
  caffeine_level?: 'low' | 'medium' | 'high';
  milk_level?: 'none' | 'little' | 'medium' | 'lots';
  bitterness_level?: number;
  acidity_level?: number;
  image_url?: string;
}

export interface Review {
  id: string;
  user: Pick<User, 'id' | 'nickname' | 'avatar_url'>;
  rating_overall: number;
  rating_taste?: number;
  rating_environment?: number;
  rating_service?: number;
  rating_value?: number;
  content?: string;
  images: string[];
  created_at: string;
}

export interface Favorite {
  id: string;
  shop_id: string;
  created_at: string;
}

export interface Checkin {
  id: string;
  user: Pick<User, 'id' | 'nickname' | 'avatar_url'>;
  shop_id: string;
  content?: string;
  images: string[];
  created_at: string;
}

export interface RankingItem {
  rank: number;
  id: string;
  name: string;
  name_en?: string;
  rating: number;
  review_count: number;
  popularity_score: number;
  cover_image_url?: string;
}

export interface MerchantApplication {
  id: string;
  shop_name: string;
  status: 'pending' | 'approved' | 'rejected';
  reject_reason?: string;
  created_at: string;
}