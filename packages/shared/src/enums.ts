export enum UserRole {
  USER = 'user',
  MERCHANT = 'merchant',
  ADMIN = 'admin',
}

export enum ShopStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

export enum CoffeeCategory {
  ESPRESSO = 'espresso',
  BREWED = 'brewed',
  COLD = 'cold',
  SPECIALTY = 'specialty',
}

export enum CaffeineLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum MilkLevel {
  NONE = 'none',
  LITTLE = 'little',
  MEDIUM = 'medium',
  LOTS = 'lots',
}

export enum RankingType {
  POPULARITY = 'popularity',
  RATING = 'rating',
  REVIEWS = 'reviews',
  FAVORITES = 'favorites',
  NEWEST = 'newest',
}

export enum ReviewStatus {
  VISIBLE = 'visible',
  HIDDEN = 'hidden',
  PENDING = 'pending',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}