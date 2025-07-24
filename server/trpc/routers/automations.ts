import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';

// In a real app, the Prisma client would be initialized once in a context file.
const prisma = new PrismaClient();

// --- MOCK EMAIL/SMS SENDING FUNCTIONS ---
// In a real app, these would integrate with services like Twilio and Resend.
const sendSms = async (phoneNumber: string, message: string) => {
  console.log(`[SMS] Sending to ${phoneNumber}: "${message}"`);
  // Mock success
  return { success: true, sid: `SM${Math.random().toString(36).substring(2)}` };
};

const sendEmail = async (email: string, subject: string, body: string) => {
  console.log(`[EMAIL] Sending to ${email} with subject "${subject}"`);
  // Mock success
  return { success: true, messageId: `<${Math.random().toString(36).substring(2)}@mufta.com>` };
};


export const automationsRouter = router({
  /**
   * This procedure would be run by a cron job once every day.
   * It finds all users whose birthday is today and sends them a configured reward.
   */
  triggerBirthdayRewards: publicProcedure
    .mutation(async () => {
      console.log('[AUTOMATION]: Running daily birthday check...');
      
      // In a real app, you would query for users where month and day of birth match today.
      // For this example, we'll just grab one mock user.
      const usersWithBirthday = await prisma.user.findMany({
        where: {
          // This is a placeholder. A real implementation requires storing birth dates.
          // email: 'birthday.user@example.com' 
        },
        include: { vendorProfile: true } // Assuming a vendor can have a birthday too
      });

      if (usersWithBirthday.length === 0) {
        console.log('[AUTOMATION]: No birthdays today.');
        return { success: true, sent: 0 };
      }

      // Find all vendors who have enabled the birthday automation
      const vendorsWithAutomation = await prisma.vendor.findMany({
        where: {
          // In a real app, you'd have a field like `isBirthdayAutomationActive: true`
        }
      });

      let sentCount = 0;
      for (const user of usersWithBirthday) {
        for (const vendor of vendorsWithAutomation) {
            // In a real app, you would check if the user is a customer of this vendor.
            // And get the vendor's custom message from the database.
            const message = `Happy Birthday from ${vendor.businessName}! Enjoy a free gift on us.`;
            if (user.phoneNumber) {
                await sendSms(user.phoneNumber, message);
                sentCount++;
            }
        }
      }

      console.log(`[AUTOMATION]: Sent ${sentCount} birthday messages.`);
      return { success: true, sent: sentCount };
    }),

  /**
   * This procedure would be run by a cron job daily.
   * It finds users who have not made a purchase in a set period (e.g., 30 days)
   * and sends them a re-engagement offer.
   */
  triggerReEngagementCampaigns: publicProcedure
    .mutation(async () => {
        console.log('[AUTOMATION]: Running daily re-engagement check...');

        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));

        // Find users whose last order was more than 30 days ago.
        const inactiveUsers = await prisma.user.findMany({
            where: {
                orders: {
                    every: {
                        createdAt: {
                            lt: thirtyDaysAgo,
                        },
                    },
                    some: {} // Ensure they have at least one order to be considered "inactive"
                },
            },
        });
        
        if (inactiveUsers.length === 0) {
            console.log('[AUTOMATION]: No inactive users to re-engage.');
            return { success: true, sent: 0 };
        }

        // Find vendors who have this automation enabled
        const vendorsWithAutomation = await prisma.vendor.findMany({
            where: { 
                // In a real app: `isReEngagementAutomationActive: true`
            }
        });

        let sentCount = 0;
        for (const user of inactiveUsers) {
            for (const vendor of vendorsWithAutomation) {
                // Again, check if user is a customer of this vendor
                const message = `We miss you at ${vendor.businessName}! Here's 15% off your next purchase.`;
                if (user.email) {
                    await sendEmail(user.email, `We Miss You!`, message);
                    sentCount++;
                }
            }
        }

        console.log(`[AUTOMATION]: Sent ${sentCount} re-engagement messages.`);
        return { success: true, sent: sentCount };
    }),
});

// This router would be added to your main tRPC app router.
// A service like Vercel Cron Jobs would be configured to hit these endpoints
// on a schedule (e.g., `curl -X POST https://www.muffta.com/api/trpc/automations.triggerBirthdayRewards`).
