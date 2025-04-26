import {
  HttpException,
  Controller,
  Body,
  Get,
  Post,
  Req,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginData } from '@/entities/auth';
import { AuthEndpoint } from '@/apis/auth-endpoint';
import { RequestStore } from '@/stores/request';
import { AuthFeature } from '@/features/auth';
import { NonceResponseDto } from './nonce.response-dto';
import { NonceRequestDto } from './nonce.request-dto';
import { LoginResponseDto } from './login.response-dto';
import { LoginRequestDto } from './login.request-dto';

const updateRefreshToken = (res: Response, loginData: LoginData): void => {
  res.cookie('refreshToken', loginData.refreshToken, {
    httpOnly: true,
    maxAge: loginData.refreshExpireMs,
  });
};

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly auth: AuthFeature,
    private readonly requestStorage: RequestStore,
  ) {}

  @Post('/nonce')
  @ApiResponse({ status: 201, type: NonceResponseDto })
  @SerializeOptions({ type: NonceResponseDto })
  createNonce(@Body() body: NonceRequestDto): Promise<NonceResponseDto> {
    return this.auth.createNonce(body.ethAddress);
  }

  @Post('/login')
  @ApiResponse({ status: 201, type: LoginResponseDto })
  @SerializeOptions({ type: LoginResponseDto })
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const loginData = await this.auth.createSession(
      body.ethAddress,
      body.signedNonce,
    );

    updateRefreshToken(res, loginData);
    return loginData;
  }

  @Post('/refresh-tokens')
  @ApiResponse({ status: 201, type: LoginResponseDto })
  @SerializeOptions({ type: LoginResponseDto })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const refreshToken: string = req.cookies?.refreshToken;
    if (!refreshToken) throw new HttpException('No refresh token', 401);

    const loginData = await this.auth.refreshSession(refreshToken);

    updateRefreshToken(res, loginData);
    return loginData;
  }

  @Get('/test-access')
  @AuthEndpoint()
  @ApiResponse({ status: 200, type: String })
  @SerializeOptions({ type: String })
  testAccess(): string {
    return this.requestStorage.ethAddress;
  }
}
