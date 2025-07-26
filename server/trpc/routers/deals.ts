// This file is located at: /server/trpc/routers/deals.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dealsRouter = router({
  /**
   * Fetches a list of deals from the database, optionally filtered by city.
   */
  getDeals: publicProcedure
    .input(
      z.object({
        city: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      // This is now a live database query.
      // Note: The model is named 'Service' in our Prisma schema.
      const deals = await prisma.service.findMany({
        where: {
          // In a real app, you would filter by city here if the 'Service' model had a city field.
          // For now, we fetch all services.
        },
        include: {
          vendor: true, // Include vendor information in the response
        }
      });

      // We map the database response to match the front-end's expected 'Deal' type.
      return deals.map(deal => ({
        id: deal.id,
        vendor: deal.vendor.businessName,
        title: deal.title,
        price: deal.price,
        imageUrl: `https://placehold.co/600x400/2E1065/FFFFFF?text=${deal.title.replace(/\s/g, '+')}`, // Placeholder image
        city: 'Gujranwala', // Placeholder city
        // Add other fields from your 'Service' model as needed
        type: 'Coupon',
        category: 'coupons',
        description: deal.description,
        rules: 'Standard rules apply.',
        stock: 100,
        sold: 0,
        status: 'Active',
        endDate: new Date(),
      }));
    }),
});
