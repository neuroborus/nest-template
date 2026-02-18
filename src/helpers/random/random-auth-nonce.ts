import { generateNonce } from 'siwe';

export const randomAuthNonce = (): string => generateNonce();
