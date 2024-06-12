import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    AuthModule,
    SharedModule,
    UserModule,
    HomeModule,
  ],
  controllers: [],
  providers: [],
  exports: [AuthModule, SharedModule, UserModule],
})
export class AppModule {}
