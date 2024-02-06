import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GovernanceAiController } from './governance-ai/governance-ai.controller';
import { GovernanceAiService } from './governance-ai/governance-ai.service';

@Module({
  imports: [],
  controllers: [AppController, GovernanceAiController],
  providers: [AppService, GovernanceAiService],
})
export class AppModule {}
