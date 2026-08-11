import { Router, Query } from 'nestjs-trpc';

@Router({ alias: 'health'})
export class HealthRouter {
  @Query()
  health() {
    return {
      status: 'ok',
    };
  }
}
