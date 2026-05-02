export interface City {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  population?: number;
  latitude?: number;
  longitude?: number;
}

export interface CoffeeShop {
  id: string;
  name: string;
  nameEn: string;
  cityId: string;
  address: string;
  addressEn?: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  reviewCount: number;
  priceRange: 'low' | 'medium' | 'high';
  openingHours?: string;
  description?: string;
  descriptionEn?: string;
  imageUrl?: string;
  website?: string;
  phone?: string;
  tags: string[];
  tagsEn?: string[];
}

export interface CoffeeType {
  id: string;
  name: string;
  nameEn: string;
  origin: string;
  originEn?: string;
  history: string;
  historyEn?: string;
  flavorProfile: string;
  flavorProfileEn?: string;
  caffeineContent: 'low' | 'medium' | 'high';
  taste: 'sweet' | 'bitter' | 'balanced' | 'fruity' | 'nutty' | 'chocolatey' | 'smooth';
  description: string;
  descriptionEn?: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  coffeeShopId: string;
  userName: string;
  rating: number;
  content: string;
  contentEn?: string;
  date: string;
  source: 'meituan' | 'eleme' | 'other';
  helpful: number;
}

export interface PopularityData {
  id: string;
  coffeeShopId: string;
  cityId: string;
  date: string;
  popularityScore: number;
  orderCount: number;
  searchCount: number;
  source: 'meituan' | 'eleme' | 'other';
}

export interface CoffeeShopWithPopularity extends CoffeeShop {
  popularityScore: number;
  trend: 'up' | 'down' | 'stable';
  city: City;
  topCoffeeTypes: CoffeeType[];
}

export interface CityWithStats extends City {
  totalCoffeeShops: number;
  averageRating: number;
  totalReviews: number;
  topCoffeeShops: CoffeeShopWithPopularity[];
}