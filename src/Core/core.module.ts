import { Module } from '@nestjs/common';
import { ProjectService } from './projects.service';
import { DbConnector } from './Base/DbConnector.service';

@Module({
  providers: [ProjectService, DbConnector],
  exports: [ProjectService],
})
export class CoreModule {}
