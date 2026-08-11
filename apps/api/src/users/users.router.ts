import { Inject } from '@nestjs/common';
import { Router, Query, Input } from 'nestjs-trpc';
import { UsersService } from './users.service';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
 
const usersSchema = z.object({
  name: z.string(),
  email: z.string()
});
 
type User = z.infer<typeof usersSchema>;
 
@Router({ alias: 'users' })
export class UsersRouter {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}
 
  @Query({
    input: z.object({ userId: z.string() }),
    output: usersSchema,
  })
  async getUserById(@Input('userId') userId: string): Promise<User> {
    const user = await this.usersService.getUser(userId);
 
    if (user == null) {
      throw new TRPCError({
        message: 'Could not find user.',
        code: 'NOT_FOUND',
      });
    }
 
    return user;
  }
}