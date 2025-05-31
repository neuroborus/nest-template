import { ModelData } from '../model-data';

export interface SessionData {
  userId: string;
  ipAddress: string;
  userAgent: string;

  refreshTokenHash: string;
  expired: Date;
}

export type Session = SessionData & ModelData;
