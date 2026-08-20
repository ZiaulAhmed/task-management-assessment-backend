import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

import { AppModule } from './app.module';

const server = express();

let initialized = false;

async function bootstrap() {
  if (initialized) {
    return;
  }

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.init();

  initialized = true;
}

export default async function handler(req: any, res: any) {
  try {
    await bootstrap();
    return server(req, res);
  } catch (error) {
    console.error('NESTJS STARTUP ERROR:', error);

    return res.status(500).json({
      statusCode: 500,
      message: 'NestJS startup failed',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

if (!process.env.VERCEL) {
  bootstrap()
    .then(() => {
      const port = process.env.PORT || 3000;

      server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error('LOCAL STARTUP ERROR:', error);
      process.exit(1);
    });
}