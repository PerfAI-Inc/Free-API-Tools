import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceAiController } from './governance-ai.controller';

describe('GovernanceAiController', () => {
  let controller: GovernanceAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GovernanceAiController],
    }).compile();

    controller = module.get<GovernanceAiController>(GovernanceAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
