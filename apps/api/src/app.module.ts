import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TRPCModule } from 'nestjs-trpc';

import { UsersModule } from './users/users.module';
import { HealthRouter } from './app.router';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../../.env',
    }),
    DatabaseModule,
    TRPCModule.forRoot({}),
    UsersModule,
  ],
  controllers: [HealthRouter],
})
export class AppModule {}
