import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseAiController } from './release-ai.controller';

describe('ReleaseAiController', () => {
  let controller: ReleaseAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReleaseAiController],
    }).compile();

    controller = module.get<ReleaseAiController>(ReleaseAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
