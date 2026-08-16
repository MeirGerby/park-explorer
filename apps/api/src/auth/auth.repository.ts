import { Inject, Injectable } from '@nestjs/common';
import { eq, type Database, users } from '@park-explorer/db';
import { DRIZZLE } from '../database/database.module.js';

@Injectable()
export class AuthRepository {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async findByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ?? null;
  }

  async create(
    data: { name: string; email: string; passwordHash: string },
    handlers: { onEmailTaken: () => never },
  ) {
    const existing = await this.findByEmail(data.email);

    if (existing) {
      handlers.onEmailTaken();
    }

    const [user] = await this.db.insert(users).values(data).returning();

    return user;
  }
}
