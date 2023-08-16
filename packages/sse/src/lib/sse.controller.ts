import { SseService } from './sse.service';
import { Sse, Controller } from '@nestjs/common';
import { Public } from '@interceptor';

@Controller()
export class SseController {
  constructor(private sseService: SseService) {}

  @Sse('sse')
  @Public()
  doTheSse() {
    return this.sseService.sendEvents();
  }
}