// This file should be created at: /server/trpc/routers/auth.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import { Twilio } from 'twilio';

const prisma = new PrismaClient();

// IMPORTANT: In a real app, these would be in your .env file
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || 'YOUR_SID';
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || 'YOUR_TOKEN';
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || 'YOUR_TWILIO_NUMBER';

const twilioClient = new Twilio(twilioAccountSid, twilioAuthToken);

export const authRouter = router({
  /**
   * Generates a 6-digit OTP, saves it to the user record, and sends it via SMS.
   */
  sendOtp: publicProcedure
    .input(z.object({ phone: z.string().min(10) }))
    .mutation(async ({ input }) => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

      // Find or create the user
      const user = await prisma.user.upsert({
        where: { phone: input.phone },
        update: { otp, otpExpires },
        create: { phone: input.phone, otp, otpExpires },
      });

      // Send the SMS via Twilio
      try {
        await twilioClient.messages.create({
          body: `Your Mufta verification code is: ${otp}`,
          from: twilioPhoneNumber,
          to: input.phone, // Assumes Pakistani number format, e.g., +92...
        });
        return { success: true, message: 'OTP sent successfully.' };
      } catch (error) {
        console.error("Twilio SMS failed:", error);
        throw new Error("Failed to send OTP. Please check the phone number.");
      }
    }),

  /**
   * Verifies the OTP provided by the user.
   */
  verifyOtp: publicProcedure
    .input(z.object({
      phone: z.string().min(10),
      otp: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { phone: input.phone },
      });

      if (!user || !user.otp || !user.otpExpires) {
        throw new Error("No OTP request found for this number.");
      }

      if (new Date() > user.otpExpires) {
        throw new Error("OTP has expired. Please request a new one.");
      }

      if (user.otp !== input.otp) {
        throw new Error("Invalid OTP provided.");
      }

      // OTP is correct. Mark user as verified and clear OTP fields.
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          otp: null,
          otpExpires: null,
        },
      });

      // In a real app, you would return a JWT session token here.
      return { success: true, message: "Phone number verified successfully!", user };
    }),
});
