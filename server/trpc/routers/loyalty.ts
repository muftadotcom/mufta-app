// This file is located at: /server/trpc/routers/loyalty.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const loyaltyRouter = router({
  /**
   * Fetches the current points balance for a given user from the live database.
   */
  getPointsBalance: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const result = await prisma.pointsLedger.aggregate({
        _sum: {
          points: true,
        },
        where: {
          userId: input.userId,
        },
      });
      return { totalPoints: result._sum.points || 0 };
    }),

  /**
   * Fetches the detailed transaction history (ledger) for a user from the live database.
   */
  getLedger: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const ledger = await prisma.pointsLedger.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return ledger;
    }),

  /**
   * Fetches all active stamp cards for a user.
   * NOTE: The StampCard model is not in the current Prisma schema,
   * so this will continue to return mock data for now.
   */
  getStampCards: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
        console.log(`[DB] Fetching stamp cards for user ${input.userId}`);
        // This will be replaced with a Prisma query once the schema is updated.
        return [
            { id: 1, vendor: 'Cafe Beans', title: 'Free Coffee', totalStamps: 10, currentStamps: 4, icon: '☕' },
            { id: 2, vendor: 'Pizza Planet', title: 'Free Large Pizza', totalStamps: 8, currentStamps: 8, icon: '🍕' }
        ];
    }),
    
  // ... other mutations like redeemReward and approveReceipt would go here
});
