import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRouter } from './users.router';

@Module({
  controllers: [],
  providers: [UsersService, UsersRouter],
  exports: [UsersRouter, UsersService],
})
export class UsersModule { }
