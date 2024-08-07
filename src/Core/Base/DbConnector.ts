import { PrismaClient, Prisma } from '@prisma/client';

export class DbConnector extends PrismaClient {
  constructor() {
    super();
    this.initialize();
  }
  async initialize(): Promise<void> {
    await this.$connect();
  }
}
