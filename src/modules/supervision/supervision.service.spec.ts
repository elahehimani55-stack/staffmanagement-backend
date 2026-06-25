import { Test, TestingModule } from '@nestjs/testing';
import { SupervisionService } from './supervision.service';

describe('SupervisionService', () => {
  let service: SupervisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupervisionService],
    }).compile();

    service = module.get<SupervisionService>(SupervisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
