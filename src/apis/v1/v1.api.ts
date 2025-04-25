import { Module } from '@nestjs/common';
import { AuthApi } from '@/apis/v1/auth';

@Module({
  imports: [AuthApi],
})
export class V1Api {}
