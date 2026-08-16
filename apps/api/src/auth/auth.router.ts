import { Injectable, Logger } from '@nestjs/common';
import { Router, Query, Mutation, Input, Ctx } from 'nestjs-trpc';
import { TRPCError } from '@trpc/server';
import {
  AuthService,
  EmailAlreadyTakenError,
  InvalidCredentialsError,
  UserNotFoundError,
} from './auth.service.js';
import { SESSION_COOKIE_NAME, SESSION_TTL_MS } from './session.service.js';
import type { AppContextValue } from './trpc-context.js';
import {
  loginInputSchema,
  registerInputSchema,
  userOutputSchema,
  type LoginInput,
  type RegisterInput,
} from './dto/auth.dto.js';

// A plain function, not a method on AuthRouter — nestjs-trpc maps every
// method on a @Router() class to a procedure, decorated or not, so a helper
// like this would otherwise leak into the router as a phantom endpoint.
function setSessionCookie(ctx: AppContextValue, sessionId: string): void {
  ctx.res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS,
  });
}

@Router({ alias: 'auth' })
export class AuthRouter {
  private readonly logger = new Logger(AuthRouter.name);

  constructor(private readonly authService: AuthService) {}

  @Mutation({
    input: loginInputSchema,
    output: userOutputSchema,
  })
  async login(@Input() data: LoginInput, @Ctx() ctx: AppContextValue) {
    try {
      const { user, sessionId } = await this.authService.login(data);
      setSessionCookie(ctx, sessionId);
      return user;
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message,
        });
      }

      this.logger.error('Failed to log in', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while logging in.',
        cause: error,
      });
    }
  }

  @Mutation({
    input: registerInputSchema,
    output: userOutputSchema,
  })
  async register(@Input() data: RegisterInput, @Ctx() ctx: AppContextValue) {
    try {
      const { user, sessionId } = await this.authService.register(data);
      setSessionCookie(ctx, sessionId);
      return user;
    } catch (error) {
      if (error instanceof EmailAlreadyTakenError) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: error.message,
        });
      }

      this.logger.error('Failed to register', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while registering.',
        cause: error,
      });
    }
  }

  @Query({
    output: userOutputSchema,
  })
  async me(@Ctx() ctx: AppContextValue) {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated.',
      });
    }

    try {
      return await this.authService.me(ctx.user.id);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Session is no longer valid.',
        });
      }

      this.logger.error('Failed to fetch current user', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while fetching the current user.',
        cause: error,
      });
    }
  }
}
