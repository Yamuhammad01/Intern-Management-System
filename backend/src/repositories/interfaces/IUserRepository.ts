import { User, UserRole } from '@prisma/client';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByResetToken(token: string): Promise<User | null>;
  create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
  }): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
  updateResetToken(id: string, resetToken: string | null, resetTokenExp: Date | null): Promise<void>;
  updateLastLogin(id: string): Promise<void>;
  updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
}