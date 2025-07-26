// This file should be created at: /server/trpc/routers/deals.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dealsRouter = router({
  /**
   * Fetches a list of deals, optionally filtered by city.
   */
  getDeals: publicProcedure
    .input(
      z.object({
        city: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const whereClause = input.city ? { city: input.city } : {};
      
      // In a real app, you would fetch from the database like this:
      // const deals = await prisma.deal.findMany({ where: whereClause });
      // return deals;

      // For now, returning mock data to demonstrate the connection.
      // This will be replaced with a live DB query in the next step.
      const mockDeals = [
        { id: 1, vendor: 'Pizza Planet', title: 'Buy 1 Get 1 Free Large Pizza', price: 0, type: 'Free Coupon', imageUrl: 'https://placehold.co/600x400/2E1065/FFFFFF?text=Pizza+Deal', city: 'Gujranwala', category: 'coupons', description: 'Enjoy two large pizzas for the price of one! Valid on all classic flavors.', rules: 'Not valid with other offers. Dine-in or takeaway only.', stock: 100, sold: 25, status: 'Active', endDate: new Date() },
        { id: 5, vendor: 'Lahore Eatery', title: '25% off on entire bill', price: 0, type: 'Free Coupon', imageUrl: 'https://placehold.co/600x400/2E1065/FFFFFF?text=Lahore+Deal', city: 'Lahore', category: 'coupons', description: 'A delicious 25% discount on your total bill.', rules: 'Minimum spend of PKR 1000 applies.', stock: 200, sold: 80, status: 'Active', endDate: new Date() },
      ];

      return mockDeals.filter(deal => !input.city || deal.city === input.city);
    }),
});
