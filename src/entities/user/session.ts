export interface Session {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  userId: string;
  ipAddress: string;
  userAgent: string;

  refreshTokenHash: string;
  expired: Date; // refreshToken
}
