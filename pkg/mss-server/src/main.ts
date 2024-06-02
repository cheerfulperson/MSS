import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalGuards(new AccessTokenGuard(reflector));
  await app.listen(port);
  console.log('Listening on: http://localhost:' + port);
}
bootstrap();
