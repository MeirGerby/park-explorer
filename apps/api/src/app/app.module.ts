import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TRPCModule } from 'nestjs-trpc';

import { HealthRouter } from './app.router.js';
import { DatabaseModule } from '../database/database.module.js';
import { ParksModule } from '../parks/parks.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '../../../../.env'),
    }),
    DatabaseModule,
    TRPCModule.forRoot({}),
    ParksModule,
    AuthModule,
  ],
  controllers: [HealthRouter],
})
export class AppModule {}
