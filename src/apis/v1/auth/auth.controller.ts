import {
  HttpException,
  Controller,
  Body,
  Get,
  Post,
  Req,
  Res,
  SerializeOptions,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CookieOptions, Request, Response } from 'express';
import { NODE_ENV } from '@/entities/node-env';
import { LoginData } from '@/entities/auth';
import { staticConfig } from '@/config';
import { RequestStore } from '@/stores/request';
import { AuthFeature } from '@/features/auth';
import { AuthEndpoint } from '@/apis/auth-endpoint';
import { NonceResponseDto } from './nonce.response-dto';
import { NonceRequestDto } from './nonce.request-dto';
import { LoginResponseDto } from './login.response-dto';
import { LoginRequestDto } from './login.request-dto';

const refreshToken = 'refreshToken';
const noRefreshTokenErr = new HttpException('No refresh token', 401);

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly auth: AuthFeature,
    private readonly requestStorage: RequestStore,
  ) {}

  private updateRefreshToken(res: Response, loginData: LoginData): void {
    const devOptions = {
      httpOnly: true,
      secure: false,
      maxAge: loginData.refreshExpireMs,
    };
    const prodOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'strict' as const,
      maxAge: loginData.refreshExpireMs,
    };

    const options: CookieOptions =
      staticConfig.nodeEnv === NODE_ENV.PROD ? prodOptions : devOptions;

    res.cookie(refreshToken, loginData.refreshToken, options);
  }

  private deleteRefreshToken(res: Response): void {
    res.clearCookie(refreshToken, {
      httpOnly: true,
      secure: staticConfig.nodeEnv === NODE_ENV.PROD,
      sameSite: staticConfig.nodeEnv === NODE_ENV.PROD ? 'strict' : undefined,
    });
  }

  @Post('/siwe/nonce')
  @ApiOperation({ summary: 'Create SIWE nonce challenge' })
  @ApiResponse({ status: 201, type: NonceResponseDto })
  @SerializeOptions({ type: NonceResponseDto })
  createSiweNonce(@Body() _body: NonceRequestDto): Promise<NonceResponseDto> {
    return this.auth.createNonce();
  }

  @Post('/siwe/verify')
  @ApiOperation({ summary: 'Verify SIWE message and create session' })
  @ApiResponse({ status: 201, type: LoginResponseDto })
  @SerializeOptions({ type: LoginResponseDto })
  async verifySiwe(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const loginData = await this.auth.createSession(
      body.message,
      body.signature,
    );

    this.updateRefreshToken(res, loginData);
    return loginData;
  }

  @Post('/nonce')
  @ApiOperation({
    deprecated: true,
    summary: 'Deprecated. Use POST /v1/auth/siwe/nonce',
  })
  @ApiResponse({ status: 410, type: String })
  legacyCreateNonce(): never {
    throw new HttpException('Deprecated. Use POST /v1/auth/siwe/nonce', 410);
  }

  @Post('/login')
  @ApiOperation({
    deprecated: true,
    summary: 'Deprecated. Use POST /v1/auth/siwe/verify',
  })
  @ApiResponse({ status: 410, type: String })
  legacyLogin(): never {
    throw new HttpException('Deprecated. Use POST /v1/auth/siwe/verify', 410);
  }

  @Post('/logout')
  @HttpCode(204)
  @AuthEndpoint()
  @ApiResponse({ status: 204 })
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    await this.auth.deleteSession();
    this.deleteRefreshToken(res);
  }

  @Post('/refresh-tokens')
  @ApiResponse({ status: 201, type: LoginResponseDto })
  @SerializeOptions({ type: LoginResponseDto })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const refreshToken: string = req.cookies?.refreshToken;
    if (!refreshToken) throw noRefreshTokenErr;

    const loginData = await this.auth.refreshSession(refreshToken);

    this.updateRefreshToken(res, loginData);
    return loginData;
  }

  @Get('/access')
  @AuthEndpoint()
  @ApiResponse({ status: 200, type: String })
  @SerializeOptions({ type: String })
  testAccess(): string {
    return this.requestStorage.ethAddress;
  }
}
