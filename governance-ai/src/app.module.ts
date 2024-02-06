import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GovernanceAiController } from './governance-ai/governance-ai.controller';
import { GovernanceAiService } from './governance-ai/governance-ai.service';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestTrackingMiddleware } from './middleware/request-tracking.middleware';


@Module({
  imports: [],
  controllers: [AppController, GovernanceAiController],
  providers: [AppService, GovernanceAiService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestTrackingMiddleware)
      .forRoutes('*');
  }
}
