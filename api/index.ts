import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedApp: any = null;

async function bootstrap() {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.init();

  cachedApp = app;

  return app;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap();

  const expressApp = app.getHttpAdapter().getInstance();

  return expressApp(req, res);
}