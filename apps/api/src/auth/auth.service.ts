import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthRepository } from './auth.repository.js';
import { SessionService } from './session.service.js';
import type { LoginInput, RegisterInput, UserOutput } from './dto/auth.dto.js';

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password.');
    this.name = 'InvalidCredentialsError';
  }
}

export class EmailAlreadyTakenError extends Error {
  constructor(public readonly email: string) {
    super(`Email '${email}' is already registered.`);
    this.name = 'EmailAlreadyTakenError';
  }
}

export class UserNotFoundError extends Error {
  constructor(public readonly userId: string) {
    super(`User '${userId}' was not found.`);
    this.name = 'UserNotFoundError';
  }
}

// A precomputed argon2 hash with no matching plaintext password. Verifying
// against it when the email isn't found keeps login's response time roughly
// constant, so timing can't be used to tell "unknown email" apart from
// "wrong password" and enumerate registered accounts.
const DUMMY_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,p=4,t=3$nLTxinLslvuuggseiIbVdw$jNAObRq+JOTk+paEBRXs11IzPVkpYGKa1W5XDhpNfFQ';

export interface AuthResult {
  user: UserOutput;
  sessionId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly sessionService: SessionService,
  ) {}

  async login(data: LoginInput): Promise<AuthResult> {
    const user = await this.authRepository.findByEmail(data.email);

    const passwordValid = await argon2.verify(
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
      data.password,
    );

    if (!user || !passwordValid) {
      throw new InvalidCredentialsError();
    }

    return {
      user: { id: user.id, name: user.name, email: user.email },
      sessionId: this.sessionService.create(user.id),
    };
  }

  async register(data: RegisterInput): Promise<AuthResult> {
    const passwordHash = await argon2.hash(data.password);

    const user = await this.authRepository.create(
      { name: data.name, email: data.email, passwordHash },
      {
        onEmailTaken: () => {
          throw new EmailAlreadyTakenError(data.email);
        },
      },
    );

    return {
      user: { id: user.id, name: user.name, email: user.email },
      sessionId: this.sessionService.create(user.id),
    };
  }

  async me(userId: string): Promise<UserOutput> {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return { id: user.id, name: user.name, email: user.email };
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionService.destroy(sessionId);
  }
}
