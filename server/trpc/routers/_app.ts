// File: /server/trpc/routers/_app.ts
// Description: This is the main app router that combines all other routers.
import { router } from '../trpc';
// Import your individual routers here as you create them
// import { loyaltyRouter } from './loyalty';
// import { supportRouter } from './support';

export const appRouter = router({
  // loyalty: loyaltyRouter,
  // support: supportRouter,
  // Add other routers here

  // Example procedure to confirm the backend is working
  healthcheck: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'Muffta API is running!',
    };
  }),
});

export type AppRouter = typeof appRouter;