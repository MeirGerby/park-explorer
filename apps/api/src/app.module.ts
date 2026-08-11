import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc'
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { HealthRouter } from './app.router';
@Module({
  imports: [
    TRPCModule.forRoot({}),
    UsersModule,
    HealthModule,
  ],
  controllers: [HealthRouter]
})
export class AppModule { }
