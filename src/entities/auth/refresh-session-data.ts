import { Address } from 'viem';
import { LoginData } from './login-data';

export interface RefreshSessionData {
  ethAddress: Address;
  loginData: LoginData;
}
