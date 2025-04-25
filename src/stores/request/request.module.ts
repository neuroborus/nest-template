import { Module } from '@nestjs/common';
import { RequestStore } from './request.store';

@Module({
  providers: [RequestStore],
  exports: [RequestStore],
})
export class RequestModule {}
