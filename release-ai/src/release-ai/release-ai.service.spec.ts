import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseAiService } from './release-ai.service';

describe('ReleaseAiService', () => {
  let service: ReleaseAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReleaseAiService],
    }).compile();

    service = module.get<ReleaseAiService>(ReleaseAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
