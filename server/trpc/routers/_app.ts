// File: /server/trpc/routers/_app.ts
// Description: This is the main app router that combines all other routers.

import { router, publicProcedure } from '../trpc';
import { loyaltyRouter } from './loyalty';
import { automationsRouter } from './automations';
import { dealsRouter } from './deals'; // <-- ADD THIS LINE

export const appRouter = router({
  loyalty: loyaltyRouter,
  automations: automationsRouter,
  deals: dealsRouter, // <-- ADD THIS LINE
  
  /**
   * A simple healthcheck endpoint to confirm the API is running.
   */
  healthcheck: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'Muffta API is running!',
    };
  }),
});

export type AppRouter = typeof appRouter;
