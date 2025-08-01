// server/trpc/routers/analytics.ts

import { z } from 'zod';
// Corrected import: 'router' is renamed to 'createTRPCRouter'
import { createTRPCRouter, publicProcedure } from '../trpc';

// Note: The local PrismaClient instance was removed.
// Always use the shared context: `ctx.prisma`

export const analyticsRouter = createTRPCRouter({
  // Example procedure for analytics
  getSiteStats: publicProcedure.query(async ({ ctx }) => {
    // In a real app, you would query your models here using ctx.prisma
    // For example: const userCount = await ctx.prisma.user.count();
    return {
      message: "Analytics endpoint is working.",
      // userCount: userCount, // Example
    };
  }),
});
