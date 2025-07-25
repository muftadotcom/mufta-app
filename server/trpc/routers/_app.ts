// File: /server/trpc/routers/_app.ts
// Description: This is the main app router that combines all other routers.

import { router, publicProcedure } from '../trpc';
import { loyaltyRouter } from './loyalty';
import { automationsRouter } from './automations';
// Note: The support router can be added here once created.

export const appRouter = router({
  loyalty: loyaltyRouter,
  automations: automationsRouter,
  
  /**
   * A simple healthcheck endpoint to confirm the API is running.
   * You can test this by navigating to /api/trpc/healthcheck in your browser.
   */
  healthcheck: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'Muffta API is running!',
    };
  }),
});

export type AppRouter = typeof appRouter;