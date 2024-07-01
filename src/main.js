const { NestFactory } = require('@nestjs/core');
const express = require('express');
const AppModule = require('./app.module');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = express();

  app.use(expressApp);

  const appModule = new AppModule();
  appModule.configureRoutes(expressApp);

  await app.listen(3000);
}

bootstrap();
