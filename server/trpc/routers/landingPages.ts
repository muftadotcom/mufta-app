// This file is located at: /server/trpc/routers/landingPages.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const landingPagesRouter = router({
  /**
   * Fetches a list of vendors whose landing pages are pending approval.
   */
  getPendingPages: publicProcedure
    .query(async () => {
      return prisma.vendor.findMany({
        where: { status: 'PENDING_APPROVAL' },
        include: { user: { select: { email: true, name: true } } },
      });
    }),

  /**
   * Updates the status of a vendor's landing page (e.g., approves or rejects it).
   * This should be a protected admin procedure in a real app.
   */
  updatePageStatus: publicProcedure // Should be adminProcedure
    .input(z.object({
      vendorId: z.string(),
      // The status is a simple string, so we use z.enum to validate it.
      status: z.enum(['ACTIVE', 'SUSPENDED']), 
    }))
    .mutation(async ({ input }) => {
      return prisma.vendor.update({
        where: { id: input.vendorId },
        data: { status: input.status },
      });
    }),
});
