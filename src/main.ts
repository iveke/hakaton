import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  config();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
      referrerPolicy: false,
      crossOriginOpenerPolicy: false,
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true,transform: true, }));
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
