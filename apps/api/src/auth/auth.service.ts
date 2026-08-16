import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthRepository } from './auth.repository.js';
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

// A precomputed argon2 hash with no matching plaintext password. Verifying
// against it when the email isn't found keeps login's response time roughly
// constant, so timing can't be used to tell "unknown email" apart from
// "wrong password" and enumerate registered accounts.
const DUMMY_PASSWORD_HASH =
  '$argon2id$v=19$m=65536,p=4,t=3$nLTxinLslvuuggseiIbVdw$jNAObRq+JOTk+paEBRXs11IzPVkpYGKa1W5XDhpNfFQ';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(data: LoginInput): Promise<UserOutput> {
    const user = await this.authRepository.findByEmail(data.email);

    const passwordValid = await argon2.verify(
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
      data.password,
    );

    if (!user || !passwordValid) {
      throw new InvalidCredentialsError();
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async register(data: RegisterInput): Promise<UserOutput> {
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
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
