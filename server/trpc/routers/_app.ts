// server/trpc/routers/_app.ts

import { createTRPCRouter } from '../trpc';
import { bannersRouter } from './banners';
// Import other routers here as you create them
// import { dealsRouter } from './deals';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  banners: bannersRouter,
  // deals: dealsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
