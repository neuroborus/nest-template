import { Module } from '@nestjs/common';
import { TokenApi } from './tokens';

@Module({
  imports: [TokenApi],
})
export class V1Api {}
