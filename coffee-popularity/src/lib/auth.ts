import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, UserWithPassword, CreateUserDTO, LoginDTO, AuthResponse } from '@/types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'coffee-popularity-secret-key';
const SALT_ROUNDS = 10;

// 模拟数据库（实际项目中应该使用真实数据库）
const users: Map<string, UserWithPassword> = new Map();

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): Partial<User> | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Partial<User>;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function createUser(dto: CreateUserDTO): Promise<AuthResponse> {
  // 检查邮箱是否已存在
  for (const user of users.values()) {
    if (user.email === dto.email) {
      throw new Error('邮箱已被注册');
    }
  }

  const hashedPassword = await hashPassword(dto.password);
  const now = new Date().toISOString();
  
  const user: UserWithPassword = {
    id: uuidv4(),
    email: dto.email,
    username: dto.username,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  };

  users.set(user.id, user);
  
  const { password, ...userWithoutPassword } = user;
  const token = generateToken(userWithoutPassword);
  
  return {
    user: userWithoutPassword,
    token,
  };
}

export async function loginUser(dto: LoginDTO): Promise<AuthResponse> {
  let foundUser: UserWithPassword | null = null;
  
  for (const user of users.values()) {
    if (user.email === dto.email) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    throw new Error('用户不存在');
  }

  const isValidPassword = await comparePassword(dto.password, foundUser.password);
  if (!isValidPassword) {
    throw new Error('密码错误');
  }

  const { password, ...userWithoutPassword } = foundUser;
  const token = generateToken(userWithoutPassword);
  
  return {
    user: userWithoutPassword,
    token,
  };
}

export function getUserById(userId: string): User | null {
  const user = users.get(userId);
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const user = users.get(userId);
  if (!user) return null;
  
  const updatedUser = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  users.set(userId, updatedUser);
  
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
}

export function deleteUser(userId: string): boolean {
  return users.delete(userId);
}

// 收藏功能
const favorites: Map<string, { id: string; userId: string; coffeeShopId: string; createdAt: string }> = new Map();

export function addFavorite(userId: string, coffeeShopId: string) {
  const existing = Array.from(favorites.values()).find(
    f => f.userId === userId && f.coffeeShopId === coffeeShopId
  );
  
  if (existing) {
    throw new Error('已经收藏过了');
  }
  
  const favorite = {
    id: uuidv4(),
    userId,
    coffeeShopId,
    createdAt: new Date().toISOString(),
  };
  
  favorites.set(favorite.id, favorite);
  return favorite;
}

export function removeFavorite(userId: string, coffeeShopId: string): boolean {
  const favorite = Array.from(favorites.values()).find(
    f => f.userId === userId && f.coffeeShopId === coffeeShopId
  );
  
  if (!favorite) return false;
  
  return favorites.delete(favorite.id);
}

export function getUserFavorites(userId: string) {
  return Array.from(favorites.values()).filter(f => f.userId === userId);
}

export function isFavorited(userId: string, coffeeShopId: string): boolean {
  return Array.from(favorites.values()).some(
    f => f.userId === userId && f.coffeeShopId === coffeeShopId
  );
}

// 评价功能
const reviews: Map<string, { id: string; userId: string; coffeeShopId: string; rating: number; content: string; createdAt: string; updatedAt: string }> = new Map();

export function addReview(userId: string, coffeeShopId: string, rating: number, content: string) {
  const review = {
    id: uuidv4(),
    userId,
    coffeeShopId,
    rating,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  reviews.set(review.id, review);
  return review;
}

export function updateReview(reviewId: string, userId: string, rating?: number, content?: string) {
  const review = reviews.get(reviewId);
  if (!review || review.userId !== userId) return null;
  
  const updatedReview = {
    ...review,
    rating: rating ?? review.rating,
    content: content ?? review.content,
    updatedAt: new Date().toISOString(),
  };
  
  reviews.set(reviewId, updatedReview);
  return updatedReview;
}

export function deleteReview(reviewId: string, userId: string): boolean {
  const review = reviews.get(reviewId);
  if (!review || review.userId !== userId) return false;
  
  return reviews.delete(reviewId);
}

export function getShopReviews(coffeeShopId: string) {
  return Array.from(reviews.values()).filter(r => r.coffeeShopId === coffeeShopId);
}

export function getUserReviews(userId: string) {
  return Array.from(reviews.values()).filter(r => r.userId === userId);
}