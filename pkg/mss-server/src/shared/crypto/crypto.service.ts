import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private secretKey: string = process.env.ENCRYPTION_KEY;
  private encryptionIV: string = process.env.ENCRYPTION_IV;
  private algorithm: string = process.env.ENCRYPTION_ALGORITHM;

  constructor() {
    if (!this.secretKey) {
      throw new Error('ENCRYPTION_KEY env is not provided');
    }
    if (!this.encryptionIV) {
      throw new Error('ENCRYPTION_IV env is not provided');
    }
    if (!this.algorithm) {
      throw new Error('ENCRYPTION_ALGORITHM env is not provided');
    }
  }

  encrypt(data: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.secretKey,
      this.encryptionIV,
    );
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
    ).toString('base64');
  }

  decrypt(data: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      this.encryptionIV,
    );
    return Buffer.from(
      decipher.update(
        Buffer.from(data, 'base64').toString('hex'),
        'hex',
        'utf8',
      ) + decipher.final('utf8'),
    ).toString();
  }
}
