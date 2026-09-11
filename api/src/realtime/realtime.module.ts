import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service.js';
import { RealtimeGateway } from './realtime.gateway.js';

@Module({
  providers: [PresenceService, RealtimeGateway],
  exports: [PresenceService],
})
export class RealtimeModule {}
