import { Injectable } from '@nestjs/common';
import type { TRPCContext } from 'nestjs-trpc';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { SessionService, SESSION_COOKIE_NAME } from './session.service.js';

export interface AppContextValue extends Record<string, unknown> {
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];
  user: { id: string } | null;
}

@Injectable()
export class AppContext implements TRPCContext {
  constructor(private readonly sessionService: SessionService) {}

  create(opts: CreateExpressContextOptions): AppContextValue {
    const sessionId: string | undefined = opts.req.cookies?.[SESSION_COOKIE_NAME];
    const session = sessionId ? this.sessionService.get(sessionId) : null;

    return {
      req: opts.req,
      res: opts.res,
      user: session ? { id: session.userId } : null,
    };
  }
}
