import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import { ApiResponse } from '../utils/ApiResponse';
import {
  RegisterRequestDTO,
  LoginRequestDTO,
  RefreshTokenRequestDTO,
  ForgotPasswordRequestDTO,
  ResetPasswordRequestDTO,
  ChangePasswordRequestDTO,
} from '../dto/auth.dto';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register = asyncHandler(async (req: Request, res: Response) => {
    const dto: RegisterRequestDTO = req.body;
    const result = await this.authService.register(dto);
    res.status(201).json(ApiResponse.created(result, 'Registration successful'));
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    const dto: LoginRequestDTO = req.body;
    const result = await this.authService.login(dto.email, dto.password);
    res.status(200).json(ApiResponse.success(result, 'Login successful'));
  });

  public refresh = asyncHandler(async (req: Request, res: Response) => {
    const dto: RefreshTokenRequestDTO = req.body;
    const result = await this.authService.refreshTokens(dto.refreshToken);
    res.status(200).json(ApiResponse.success(result, 'Tokens refreshed'));
  });

  public logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await this.authService.logout(refreshToken);
    res.status(200).json(ApiResponse.success(null, 'Logged out successfully'));
  });

  public logoutAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    await this.authService.logoutAll(userId);
    res.status(200).json(ApiResponse.success(null, 'Logged out from all devices'));
  });

  public forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const dto: ForgotPasswordRequestDTO = req.body;
    await this.authService.forgotPassword(dto.email);
    res.status(200).json(
      ApiResponse.success(null, 'If the email exists, a reset link has been sent'),
    );
  });

  public resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const dto: ResetPasswordRequestDTO = req.body;
    await this.authService.resetPassword(dto.token, dto.password);
    res.status(200).json(ApiResponse.success(null, 'Password has been reset successfully'));
  });

  public changePassword = asyncHandler(async (req: Request, res: Response) => {
    const dto: ChangePasswordRequestDTO = req.body;
    const userId = req.user!.userId;
    await this.authService.changePassword(userId, dto.currentPassword, dto.newPassword);
    res.status(200).json(ApiResponse.success(null, 'Password changed successfully'));
  });

  public getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await this.authService.getCurrentUser(userId);
    res.status(200).json(ApiResponse.success(user, 'Current user retrieved'));
  });
}