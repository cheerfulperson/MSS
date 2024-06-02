import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
  exports: [AuthModule, UserModule],
})
export class AppModule {}
