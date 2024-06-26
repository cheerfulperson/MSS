import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { mqttBroker } from './adapters/mqtt-broker.adapter';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173', 'https://ihome-master.netlify.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const reflector = app.get(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalGuards(new AccessTokenGuard(reflector));
  mqttBroker.start(app.getHttpServer());
  await app.listen(port);
  console.log('Listening on: http://localhost:' + port);
}
bootstrap();
