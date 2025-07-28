// This file should be created at: /server/trpc/routers/analytics.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const analyticsRouter = router({
  /**
   * Fetches the Key Performance Indicators (KPIs) for the admin dashboard.
   */
  getKpiData: publicProcedure
    .query(async () => {
      // In a real app, these would be complex database queries.
      // For now, we'll return mock data that simulates the real structure.
      const totalRevenue = 1200000;
      const activeUsers = 25849;
      const newVendors = 32;
      const pendingRefunds = 12;

      return { totalRevenue, activeUsers, newVendors, pendingRefunds };
    }),

  /**
   * Fetches data for the user growth chart.
   * Groups new users by the day they signed up.
   */
  getUserGrowth: publicProcedure
    .query(async () => {
      // MOCK DATA: Simulates a real Prisma group-by query.
      // A real query would look something like:
      // await prisma.user.groupBy({ by: ['createdAt'], _count: { id: true } })
      return [
        { date: '2025-07-01', signups: 10 },
        { date: '2025-07-02', signups: 15 },
        { date: '2025-07-03', signups: 12 },
        { date: '2025-07-04', signups: 22 },
        { date: '2025-07-05', signups: 30 },
        { date: '2025-07-06', signups: 25 },
        { date: '2025-07-07', signups: 28 },
      ];
    }),

  /**
   * Fetches data for the revenue over time chart.
   * Groups total order value by the day the order was created.
   */
  getRevenueOverTime: publicProcedure
    .query(async () => {
      // MOCK DATA: Simulates a real Prisma group-by and sum query.
      return [
        { date: '2025-07-01', revenue: 12000 },
        { date: '2025-07-02', revenue: 18000 },
        { date: '2025-07-03', revenue: 15000 },
        { date: '2025-07-04', revenue: 25000 },
        { date: '2025-07-05', revenue: 32000 },
        { date: '2025-07-06', revenue: 28000 },
        { date: '2025-07-07', revenue: 31000 },
      ];
    }),
    
  /**
   * Fetches a list of the top-performing deals.
   * In a real app, this would be sorted by redemptions or views.
   */
  getTopDeals: publicProcedure
    .query(async () => {
        // MOCK DATA: Simulating a query to get top deals.
        return [
            { id: 1, title: 'Buy 1 Get 1 Free Large Pizza', vendor: 'Pizza Planet', redemptions: 1520 },
            { id: 7, title: 'Win a Gaming Laptop', vendor: 'Tech Giveaway', redemptions: 1250 },
            { id: 2, title: 'Flat 30% Off on All Jeans', vendor: 'The Style Hub', redemptions: 980 },
        ];
    }),
});
