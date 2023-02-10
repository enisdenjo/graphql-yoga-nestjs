import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function createFastifyApp() {
  return NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
}

async function createExpressApp() {
  return NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());
}

async function bootstrap() {
  const app = process.env.FASTIFY ? await createFastifyApp() : await createExpressApp();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  Logger.log(`Application is running on: ${await app.getUrl()} 🚀`, 'NestApplication');
}
bootstrap();
