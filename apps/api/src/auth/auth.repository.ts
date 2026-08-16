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
}
