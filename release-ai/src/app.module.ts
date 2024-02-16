import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReleaseAiController } from './release-ai/release-ai.controller';
import { ReleaseAiService } from './release-ai/release-ai.service';

@Module({
  imports: [],
  controllers: [AppController, ReleaseAiController],
  providers: [AppService, ReleaseAiService],
})
export class AppModule {}
