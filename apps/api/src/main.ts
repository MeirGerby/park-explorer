import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createExpressMiddleware } from "@trpc/server/adapters/express"
import { appRouter } from "./trpc/app.router"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
  app.use(
    "/trpc",
    createExpressMiddleware({
      router: appRouter,
    }),
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
