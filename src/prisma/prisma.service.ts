import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  prisma,
  PrismaClient,
} from '@prisma/client';

// import 'dotenv/config';

@Injectable({})
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
    console.log(config.get('DATABASE_URL'));
  }
  cleanDb() {
    return this.$transaction([
      this.todo.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
