import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

let app: any;

async function bootstrap() {
  if (app) {
    return app;
  }

  app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.FRONTEND_URL || '',
    ].filter(Boolean),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription(
      'REST API for the Task Management Assessment',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup('api/docs', app, document);

  await app.init();

  return app;
}

export default async function handler(
  req: any,
  res: any,
) {
  const application = await bootstrap();

  const expressApp =
    application.getHttpAdapter().getInstance();

  return expressApp(req, res);
}

if (!process.env.VERCEL) {
  bootstrap().then((application) => {
    application.listen(process.env.PORT || 5000);
  });
}