import { Injectable, Logger } from '@nestjs/common';
import { Router, Mutation, Input } from 'nestjs-trpc';
import { TRPCError } from '@trpc/server';
import { AuthService, EmailAlreadyTakenError, InvalidCredentialsError } from './auth.service.js';
import {
  loginInputSchema,
  registerInputSchema,
  userOutputSchema,
  type LoginInput,
  type RegisterInput,
} from './dto/auth.dto.js';

@Router({ alias: 'auth' })
export class AuthRouter {
  private readonly logger = new Logger(AuthRouter.name);

  constructor(private readonly authService: AuthService) {}

  @Mutation({
    input: loginInputSchema,
    output: userOutputSchema,
  })
  async login(@Input() data: LoginInput) {
    try {
      return await this.authService.login(data);
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
  async register(@Input() data: RegisterInput) {
    try {
      return await this.authService.register(data);
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
}
