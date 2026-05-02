import { City, CoffeeShop, CoffeeType, Review, Favorite, Checkin, RankingItem, MerchantApplication } from '@coffee-platform/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ access_token: string; user: any }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, nickname: string) {
    return this.request<{ access_token: string; user: any }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname }),
    });
  }

  async getMe() {
    return this.request<any>('/api/v1/auth/me');
  }

  // Cities
  async getCities() {
    return this.request<City[]>('/api/v1/cities/');
  }

  async getCity(cityId: string) {
    return this.request<City>(`/api/v1/cities/${cityId}`);
  }

  async getCityDistricts(cityId: string) {
    return this.request<any[]>(`/api/v1/cities/${cityId}/districts`);
  }

  // Shops
  async getShops(params?: {
    city_id?: string;
    district_id?: string;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    sort_by?: string;
    skip?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    return this.request<CoffeeShop[]>(`/api/v1/shops/?${searchParams.toString()}`);
  }

  async getShop(shopId: string) {
    return this.request<CoffeeShop>(`/api/v1/shops/${shopId}`);
  }

  async getShopRanking(cityId: string, rankingType: string = 'popularity', limit: number = 10) {
    return this.request<RankingItem[]>(`/api/v1/shops/ranking/${cityId}?ranking_type=${rankingType}&limit=${limit}`);
  }

  // Reviews
  async getShopReviews(shopId: string, skip?: number, limit?: number) {
    const searchParams = new URLSearchParams();
    if (skip) searchParams.append('skip', String(skip));
    if (limit) searchParams.append('limit', String(limit));
    return this.request<Review[]>(`/api/v1/reviews/shop/${shopId}?${searchParams.toString()}`);
  }

  async createReview(data: {
    shop_id: string;
    rating_overall: number;
    rating_taste?: number;
    rating_environment?: number;
    rating_service?: number;
    rating_value?: number;
    content?: string;
    images?: string[];
  }) {
    return this.request<Review>('/api/v1/reviews/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Favorites
  async getFavorites() {
    return this.request<Favorite[]>('/api/v1/favorites/');
  }

  async addFavorite(shopId: string) {
    return this.request<any>(`/api/v1/favorites/${shopId}`, {
      method: 'POST',
    });
  }

  async removeFavorite(shopId: string) {
    return this.request<any>(`/api/v1/favorites/${shopId}`, {
      method: 'DELETE',
    });
  }

  // Checkins
  async getMyCheckins(skip?: number, limit?: number) {
    const searchParams = new URLSearchParams();
    if (skip) searchParams.append('skip', String(skip));
    if (limit) searchParams.append('limit', String(limit));
    return this.request<Checkin[]>(`/api/v1/checkins/user/me?${searchParams.toString()}`);
  }

  async createCheckin(data: {
    shop_id: string;
    content?: string;
    images?: string[];
  }) {
    return this.request<Checkin>('/api/v1/checkins/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Coffee Types
  async getCoffeeTypes() {
    return this.request<CoffeeType[]>('/api/v1/coffee-types/');
  }

  async getCoffeeType(slug: string) {
    return this.request<CoffeeType>(`/api/v1/coffee-types/${slug}`);
  }

  // Merchant
  async applyMerchant(data: {
    shop_name: string;
    contact_name: string;
    contact_phone: string;
    address: string;
    license_image_url?: string;
  }) {
    return this.request<MerchantApplication>('/api/v1/merchant/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyMerchantApplications() {
    return this.request<MerchantApplication[]>('/api/v1/merchant/my-applications');
  }

  // Admin
  async getMerchantApplications(status?: string) {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append('status', status);
    return this.request<MerchantApplication[]>(`/api/v1/admin/merchant-applications?${searchParams.toString()}`);
  }

  async approveApplication(applicationId: string) {
    return this.request<any>(`/api/v1/admin/merchant-applications/${applicationId}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectApplication(applicationId: string, rejectReason?: string) {
    return this.request<any>(`/api/v1/admin/merchant-applications/${applicationId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reject_reason: rejectReason }),
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;