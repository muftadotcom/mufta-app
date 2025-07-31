// File: /server/trpc/routers/_app.ts

import { router, publicProcedure } from '../trpc';
import { loyaltyRouter } from './loyalty';
import { automationsRouter } from './automations';
import { dealsRouter } from './deals';
import { marketingRouter } from './marketing';
import { footerRouter } from './footer';
import { landingPagesRouter } from './landingPages';
import { analyticsRouter } from './analytics';
import { authRouter } from './auth';
import { bannersRouter } from './banners';

export const appRouter = router({
  loyalty: loyaltyRouter,
  automations: automationsRouter,
  deals: dealsRouter,
  marketing: marketingRouter,
  footer: footerRouter,
  landingPages: landingPagesRouter,
  analytics: analyticsRouter,
  auth: authRouter,
  banners: bannersRouter,
  
  healthcheck: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'Muffta API is running!',
    };
  }),
});

export type AppRouter = typeof appRouter;
