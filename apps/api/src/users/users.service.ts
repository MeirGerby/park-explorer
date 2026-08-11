import { Injectable } from '@nestjs/common';

export interface User {
  name: string;
  email: string;
}

@Injectable()
export class UsersService {

    private users: Record<string, User> = {
    '1': {
      name: 'John Doe',
      email: 'john@example.com',
    },
    '2': {
      name: 'meir',
      email: 'meirg.com',
    },
  };

  async getUser(userId: string): Promise<User | null> {
    const user = this.users[userId];
    return user ?? null;
  }
}