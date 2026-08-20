import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express, { Request, Response } from 'express';

const server = express();

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(
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
  }

  return app;
}

server.all('*', async (req: Request, res: Response) => {
  try {
    await bootstrap();
    server(req, res);
  } catch (error) {
    console.error('NestJS startup error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
});

if (!process.env.VERCEL) {
  bootstrap().then(() => {
    server.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT || 3000}`,
      );
    });
  });
}

export default server;