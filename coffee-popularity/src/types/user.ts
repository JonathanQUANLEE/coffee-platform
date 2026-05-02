export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalFavorites: number;
    totalReviews: number;
    averageRating: number;
  };
}

export interface UserWithPassword extends User {
  password: string;
}

export interface CreateUserDTO {
  email: string;
  username: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Favorite {
  id: string;
  userId: string;
  coffeeShopId: string;
  createdAt: string;
}

export interface UserReview {
  id: string;
  userId: string;
  coffeeShopId: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  favorites: Favorite[];
  reviews: UserReview[];
  stats: {
    totalFavorites: number;
    totalReviews: number;
    averageRating: number;
  };
}