import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  //configure for swagger docs
  const option = new DocumentBuilder()
    .setTitle("Weather Api for Coffee-IT")
    .setDescription("check your city weather with these apis")
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, option);
  SwaggerModule.setup('api',app,document);

  await app.listen(3000);
}
bootstrap();
