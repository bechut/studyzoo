import { Test, TestingModule } from '@nestjs/testing';
import { IntroController } from './intro.controller';

describe('IntroController', () => {
  let controller: IntroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntroController],
    }).compile();

    controller = module.get<IntroController>(IntroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
