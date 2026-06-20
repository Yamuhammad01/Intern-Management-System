import { RefreshToken } from '@prisma/client';

export interface IRefreshTokenRepository {
  findByToken(token: string): Promise<RefreshToken | null>;
  create(data: {
    token: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshToken>;
  revoke(id: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}