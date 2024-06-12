import { Module } from '@nestjs/common';

import { CryptoModule } from './crypto/crypto.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CryptoModule, PrismaModule],
  exports: [CryptoModule, PrismaModule], //export this service to use in other modules
})
export class SharedModule {}
