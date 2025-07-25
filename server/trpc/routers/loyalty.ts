// This file should be at: /server/trpc/routers/loyalty.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

// In a real app, the Prisma client would be initialized once in a context file.
const prisma = new PrismaClient();

// In a real app, these would integrate with services like Twilio and Resend.
const sendSms = async (phoneNumber: string, message: string) => {
  console.log(`[SMS] Sending to ${phoneNumber}: "${message}"`);
  return { success: true, sid: `SM${Math.random().toString(36).substring(2)}` };
};

const sendEmail = async (email: string, subject: string, body: string) => {
  console.log(`[EMAIL] Sending to ${email} with subject "${subject}"`);
  return { success: true, messageId: `<${Math.random().toString(36).substring(2)}@mufta.com>` };
};


export const loyaltyRouter = router({
  /**
   * Fetches the current points balance for a given user.
   */
  getPointsBalance: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const ledgerEntries = await prisma.pointsLedger.findMany({
        where: { userId: input.userId },
        select: { points: true }, // Corrected field name from 'delta' to 'points'
      });

      const totalPoints = ledgerEntries.reduce((sum, entry) => sum + entry.points, 0);
      return { totalPoints };
    }),

  /**
   * Fetches the detailed transaction history (ledger) for a user.
   */
  getLedger: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const ledger = await prisma.pointsLedger.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: 'desc' },
        take: 50, // Paginate for performance in a real app
      });
      return ledger;
    }),

  /**
   * Processes a scanned receipt QR code to award points to a user.
   */
  approveReceipt: publicProcedure
    .input(z.object({
      userId: z.string(),
      vendorId: z.string(),
      invoiceId: z.string(),
      amount: z.number().positive(),
      containsStampableItem: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      console.log(`Checking for duplicate invoice: ${input.invoiceId}`);
      const pointsPerPkr = 0.1; 
      const pointsEarned = Math.floor(input.amount * pointsPerPkr);

      if (pointsEarned <= 0) {
        throw new Error("Purchase amount is too low to earn points.");
      }

      const newLedgerEntry = await prisma.pointsLedger.create({
        data: {
          userId: input.userId,
          vendorId: input.vendorId,
          points: pointsEarned, // Corrected field name from 'delta' to 'points'
          reason: `Points earned from purchase at Vendor ${input.vendorId}`,
        },
      });
      
      if (input.containsStampableItem) {
          console.log(`[Stamp Card] Stamping card for user ${input.userId} at vendor ${input.vendorId}`);
      }

      return {
        success: true,
        pointsEarned,
        newLedgerEntry,
      };
    }),

    /**
     * Allows a user to redeem their points for a specific reward.
     */
    redeemReward: publicProcedure
        .input(z.object({
            userId: z.string(),
            rewardId: z.string(),
            pointsCost: z.number().positive(),
        }))
        .mutation(async ({ input }) => {
            const ledgerEntries = await prisma.pointsLedger.findMany({
                where: { userId: input.userId },
                select: { points: true }, // Corrected field name from 'delta' to 'points'
            });
            const totalPoints = ledgerEntries.reduce((sum, entry) => sum + entry.points, 0);

            if (totalPoints < input.pointsCost) {
                throw new Error("Insufficient points to redeem this reward.");
            }

            const redemptionEntry = await prisma.pointsLedger.create({
                data: {
                    userId: input.userId,
                    vendorId: "SYSTEM", // Or find vendorId from rewardId
                    points: -input.pointsCost, // Corrected field name from 'delta' to 'points'
                    reason: `Redeemed reward #${input.rewardId}`,
                },
            });

            const voucherCode = `MUFTA-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
            
            return {
                success: true,
                voucherCode,
                redemptionEntry,
            };
        }),
        
    /**
     * Fetches all active stamp cards for a user.
     */
    getStampCards: publicProcedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
            console.log(`[DB] Fetching stamp cards for user ${input.userId}`);
            return [
                { id: 1, vendor: 'Cafe Beans', title: 'Free Coffee', totalStamps: 10, currentStamps: 4, icon: '☕' },
                { id: 2, vendor: 'Pizza Planet', title: 'Free Large Pizza', totalStamps: 8, currentStamps: 8, icon: '🍕' }
            ];
        }),

    /**
     * Adds a stamp to a user's card.
     */
    stampCard: publicProcedure
        .input(z.object({
            userId: z.string(),
            stampCardId: z.string(),
        }))
        .mutation(async ({ input }) => {
            console.log(`[DB] Stamping card ${input.stampCardId} for user ${input.userId}`);
            return { success: true, message: "Card stamped successfully!" };
        }),
});
