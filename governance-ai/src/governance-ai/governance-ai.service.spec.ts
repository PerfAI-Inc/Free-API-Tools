import { Test, TestingModule } from '@nestjs/testing';
import { GovernanceAiService } from './governance-ai.service';

describe('GovernanceAiService', () => {
  let service: GovernanceAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GovernanceAiService],
    }).compile();

    service = module.get<GovernanceAiService>(GovernanceAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
