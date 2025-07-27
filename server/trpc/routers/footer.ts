// This file should be created at: /server/trpc/routers/footer.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const footerRouter = router({
  /**
   * Fetches the current footer settings.
   * It uses `findFirst` because there should only ever be one row of settings.
   */
  getSettings: publicProcedure
    .query(async () => {
      const settings = await prisma.footerSettings.findFirst();
      // If no settings exist yet, create a default entry
      if (!settings) {
        return prisma.footerSettings.create({
          data: {
            aboutUs: "Mufta is your one-stop shop for the best deals and rewards in town. Discover amazing offers from local vendors and save big on your everyday purchases.",
            contactEmail: "support@mufta.com",
            contactPhone: "+92 300 1234567",
            address: "123 Commerce Road, Lahore, Pakistan",
            facebookUrl: "https://facebook.com",
            twitterUrl: "https://twitter.com",
            instagramUrl: "https://instagram.com",
          },
        });
      }
      return settings;
    }),

  /**
   * Updates the footer settings. This would be a protected admin procedure in a real app.
   */
  updateSettings: publicProcedure // Should be adminProcedure
    .input(z.object({
      id: z.string(),
      aboutUs: z.string(),
      contactEmail: z.string().email(),
      contactPhone: z.string(),
      address: z.string(),
      facebookUrl: z.string().url().optional(),
      twitterUrl: z.string().url().optional(),
      instagramUrl: z.string().url().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updatedSettings = await prisma.footerSettings.update({
        where: { id },
        data,
      });
      return updatedSettings;
    }),
});