import { Test, TestingModule } from '@nestjs/testing';
import { SharedSpaceService } from './shared-space.service';

describe('SharedSpaceService', () => {
  let service: SharedSpaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedSpaceService],
    }).compile();

    service = module.get<SharedSpaceService>(SharedSpaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
