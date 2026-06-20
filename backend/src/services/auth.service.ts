import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserRole } from '@prisma/client';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IRefreshTokenRepository } from '../repositories/interfaces/IRefreshTokenRepository';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  AccessTokenPayload,
} from '../utils/token';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/environment';
import {
  RegisterRequestDTO,
  RegisterResponseDTO,
  LoginResponseDTO,
  RefreshTokenResponseDTO,
} from '../dto/auth.dto';

export class AuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async register(dto: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw ApiError.conflict('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, env.BCRYPT_SALT_ROUNDS);

    const user = await this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: UserRole.INTERN,
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async login(email: string, password: string): Promise<LoginResponseDTO> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated. Contact administrator.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate tokens
    const accessPayload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(accessPayload);

    // Create refresh token record in DB
    const refreshTokenValue = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenRepo.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt,
    });

    const refreshToken = signRefreshToken({ userId: user.id, tokenId: refreshTokenValue });

    // Update last login
    await this.userRepo.updateLastLogin(user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshTokens(refreshTokenStr: string): Promise<RefreshTokenResponseDTO> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshTokenStr);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    // Find the stored token
    const storedToken = await this.refreshTokenRepo.findByToken(payload.tokenId);
    if (!storedToken || storedToken.revoked) {
      throw ApiError.unauthorized('Refresh token has been revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw ApiError.unauthorized('Refresh token has expired');
    }

    // Get user
    const user = await this.userRepo.findById(storedToken.userId);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    // Revoke old refresh token
    await this.refreshTokenRepo.revoke(storedToken.id);

    // Generate new tokens
    const accessPayload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = signAccessToken(accessPayload);

    // Create new refresh token record
    const newRefreshTokenValue = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepo.create({
      token: newRefreshTokenValue,
      userId: user.id,
      expiresAt,
    });

    const newRefreshToken = signRefreshToken({
      userId: user.id,
      tokenId: newRefreshTokenValue,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshTokenStr: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshTokenStr);
      const storedToken = await this.refreshTokenRepo.findByToken(payload.tokenId);
      if (storedToken && !storedToken.revoked) {
        await this.refreshTokenRepo.revoke(storedToken.id);
      }
    } catch {
      // Even if token is invalid, logout should succeed
      return;
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenRepo.revokeAllByUserId(userId);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    
    // Always return success to prevent email enumeration
    if (!user) {
      return;
    }

    const resetToken = generateResetToken();
    const resetTokenExp = new Date();
    resetTokenExp.setHours(resetTokenExp.getHours() + 1); // 1 hour expiry

    await this.userRepo.updateResetToken(user.id, resetToken, resetTokenExp);

    // In production, send email via mail service
    // For now, we log the token
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log(`[DEV] Password reset URL: ${resetUrl}`);

    // TODO: Integrate with email service (nodemailer/SendGrid)
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findByResetToken(token);
    if (!user) {
      throw ApiError.badRequest('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
    await this.userRepo.updatePassword(user.id, hashedPassword);

    // Revoke all refresh tokens for security
    await this.refreshTokenRepo.revokeAllByUserId(user.id);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS);
    await this.userRepo.updatePassword(userId, hashedPassword);
  }

  async getCurrentUser(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
    };
  }
}