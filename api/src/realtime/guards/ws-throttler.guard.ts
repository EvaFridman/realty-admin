import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext): { req: Record<string, any>; res: Record<string, any> } {
    const wsCtx = context.switchToWs();
    const socket = wsCtx.getClient<Socket>();
    return { req: socket, res: {} };
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    return req.id;
  }

  protected async throwThrottlerException(context: ExecutionContext): Promise<void> {
    const socket = context.switchToWs().getClient<Socket>();
    console.warn(`[SECURITY] Сокет ${socket.id} превысил лимит событий через Throttler. Принудительное отключение.`);
    socket.disconnect(true);
    throw new WsException('Rate limit exceeded');
  }
}
