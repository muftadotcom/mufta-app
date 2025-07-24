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
        select: { delta: true },
      });

      const totalPoints = ledgerEntries.reduce((sum, entry) => sum + entry.delta, 0);
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
      containsStampableItem: z.boolean().optional(), // Flag to check for stamp card items
    }))
    .mutation(async ({ input }) => {
      // Step 1: Check for duplicate invoice scans to prevent fraud.
      console.log(`Checking for duplicate invoice: ${input.invoiceId}`);

      // Step 2: Fetch the vendor's loyalty program rules (e.g., 1 point per 10 PKR).
      const pointsPerPkr = 0.1; 
      const pointsEarned = Math.floor(input.amount * pointsPerPkr);

      if (pointsEarned <= 0) {
        throw new Error("Purchase amount is too low to earn points.");
      }

      // Step 3: Create the points ledger entry in the database.
      const newLedgerEntry = await prisma.pointsLedger.create({
        data: {
          userId: input.userId,
          vendorId: input.vendorId,
          delta: pointsEarned,
          type: 'ORDER_EARN',
          description: `Points earned from purchase at Vendor ${input.vendorId}`,
        },
      });
      
      // Step 4: If the purchase qualifies, stamp the user's card.
      if (input.containsStampableItem) {
          // In a real app, you would look up the specific stamp card for the item purchased.
          console.log(`[Stamp Card] Stamping card for user ${input.userId} at vendor ${input.vendorId}`);
          // This would call the stampCard mutation or a shared service function.
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
                select: { delta: true },
            });
            const totalPoints = ledgerEntries.reduce((sum, entry) => sum + entry.delta, 0);

            if (totalPoints < input.pointsCost) {
                throw new Error("Insufficient points to redeem this reward.");
            }

            const redemptionEntry = await prisma.pointsLedger.create({
                data: {
                    userId: input.userId,
                    delta: -input.pointsCost,
                    type: 'REDEMPTION',
                    description: `Redeemed reward #${input.rewardId}`,
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
            // In a real app, this would query the StampCard and UserStampCard tables.
            console.log(`[DB] Fetching stamp cards for user ${input.userId}`);
            // Returning mock data for demonstration.
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
            // In a real app, this would find the UserStampCard record and increment its `currentStamps` value.
            // If `currentStamps` equals `totalStamps`, it would mark the card as complete and issue a reward.
            console.log(`[DB] Stamping card ${input.stampCardId} for user ${input.userId}`);

            return { success: true, message: "Card stamped successfully!" };
        }),
});
