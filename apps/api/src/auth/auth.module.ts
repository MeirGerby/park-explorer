import { Module } from '@nestjs/common';
import { AuthRouter } from './auth.router.js';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repository.js';
import { SessionService } from './session.service.js';
import { AppContext } from './trpc-context.js';

@Module({
  providers: [AuthRouter, AuthService, AuthRepository, SessionService, AppContext],
})
export class AuthModule {}
