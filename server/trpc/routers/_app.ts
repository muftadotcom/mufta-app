// File: /server/trpc/routers/_app.ts

import { router, publicProcedure } from '../trpc';
import { loyaltyRouter } from './loyalty';
import { automationsRouter } from './automations';
import { dealsRouter } from './deals';
import { marketingRouter } from './marketing';
import { footerRouter } from './footer';
import { landingPagesRouter } from './landingPages'; // <-- ADD THIS LINE

export const appRouter = router({
  loyalty: loyaltyRouter,
  automations: automationsRouter,
  deals: dealsRouter,
  marketing: marketingRouter,
  footer: footerRouter,
  landingPages: landingPagesRouter, // <-- ADD THIS LINE
  
  healthcheck: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'Muffta API is running!',
    };
  }),
});

export type AppRouter = typeof appRouter;
