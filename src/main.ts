import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  await app.listen(process.env.PORT ?? 4000);
  const lis = app.getUrl()
  console.log(`Application running at ${await app.getUrl()}`);
}
await bootstrap();
