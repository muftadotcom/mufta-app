// This file should be created at: /server/trpc/routers/banners.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const bannersRouter = router({
  /**
   * Fetches ONLY the active banners for display on the homepage.
   */
  getActiveBanners: publicProcedure
    .query(async () => {
      return prisma.banner.findMany({
        where: { status: true },
        orderBy: { createdAt: 'desc' },
      });
    }),

  /**
   * Fetches ALL banners for the admin panel.
   */
  getAllBanners: publicProcedure // Should be adminProcedure
    .query(async () => {
      return prisma.banner.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }),
  
  /**
   * Creates a new banner.
   */
  createBanner: publicProcedure // Should be adminProcedure
    .input(z.object({
        name: z.string().min(3),
        position: z.string(),
        city: z.string(),
        imageUrl: z.string().url(),
        status: z.boolean(),
    }))
    .mutation(async ({ input }) => {
        return prisma.banner.create({ data: input });
    }),

  /**
   * Updates an existing banner, including its status (toggle).
   */
  updateBanner: publicProcedure // Should be adminProcedure
    .input(z.object({
        id: z.string(),
        name: z.string().min(3),
        position: z.string(),
        city: z.string(),
        imageUrl: z.string().url(),
        status: z.boolean(),
    }))
    .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return prisma.banner.update({
            where: { id },
            data,
        });
    }),

  /**
   * Deletes a banner from the database.
   */
  deleteBanner: publicProcedure // Should be adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.banner.delete({
        where: { id: input.id },
      });
    }),
});
