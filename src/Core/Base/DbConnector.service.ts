import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbConnector extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
