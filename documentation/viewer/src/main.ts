import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configure } from 'nunjucks';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  configure(
    join(
      __dirname,
      '..',
      'views',
    ) /* This code is running from the `dist` dir */,
    {
      autoescape: true,
      express: app,
    },
  );

  app.setViewEngine('njk');

  await app.listen(3000);
}
bootstrap();
