// server/trpc/routers/banners.ts

import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';

export const bannersRouter = createTRPCRouter({
  // Procedure to get all banners (publicly accessible)
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }),

  // Procedure to get active banners (publicly accessible)
  getActiveBanners: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.banner.findMany({
      where: { status: true },
      orderBy: { createdAt: 'desc' },
    });
  }),

  // Procedure to create a new banner (protected)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'Name is required.'),
        position: z.string().min(1, 'Position is required.'),
        city: z.string().min(1, 'City is required.'),
        status: z.boolean().default(true),
        imageUrl: z.string().url('Must be a valid URL.'),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.banner.create({
        data: input,
      });
    }),

  // Procedure to update an existing banner (protected)
  update: protectedProcedure
    .input(
      z.object({
        id: z.coerce.number(), // Coerces string to number
        name: z.string().min(1).optional(),
        position: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        status: z.boolean().optional(),
        imageUrl: z.string().url().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.banner.update({
        where: { id },
        data,
      });
    }),

  // Procedure to delete a banner (protected)
  delete: protectedProcedure
    .input(z.object({ id: z.coerce.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.banner.delete({
        where: { id: input.id },
      });
    }),
});