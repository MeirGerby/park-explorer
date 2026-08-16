import { Module } from '@nestjs/common';
import { AuthRouter } from './auth.router.js';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repository.js';

@Module({
  providers: [AuthRouter, AuthService, AuthRepository],
})
export class AuthModule {}
