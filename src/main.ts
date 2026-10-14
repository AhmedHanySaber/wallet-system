import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useBodyParser('text', { type: ['text/plain', 'text/*'] });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();