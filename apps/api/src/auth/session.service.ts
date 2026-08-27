import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export const SESSION_COOKIE_NAME = 'park_explorer_session';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface Session {
  userId: string;
  expiresAt: number;
}

@Injectable()
export class SessionService {
  private readonly sessions = new Map<string, Session>();

  create(userId: string): string {
    const sessionId = randomUUID();
    this.sessions.set(sessionId, { userId, expiresAt: Date.now() + SESSION_TTL_MS });
    return sessionId;
  }

  get(sessionId: string): { userId: string } | null {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    if (session.expiresAt < Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }

    return { userId: session.userId };
  }

  destroy(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}
