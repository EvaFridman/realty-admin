import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  protected async handleRequest(options: { context: ExecutionContext; limit: number; ttl: number; throttler: any; blockDuration: number }): Promise<boolean> {
    const { context, limit, ttl, throttler, blockDuration } = options;
    const socket = context.switchToWs().getClient<Socket>();
    
    const tracker = socket.id;
    const key = this.generateKey(context, tracker, throttler.name);
    
    const { totalHits } = await this.storageService.increment(key, ttl, limit, blockDuration, throttler.name);
    if (totalHits > limit) await this.throwThrottlerException(context);
    return true;
  }

  protected async throwThrottlerException(context: ExecutionContext): Promise<void> {
    const socket = context.switchToWs().getClient<Socket>();
    console.warn(`[SECURITY] Сокет ${socket.id} превысил лимит событий через Throttler. Принудительное отключение.`);
    socket.disconnect(true);
    throw new WsException('Rate limit exceeded');
  }
}