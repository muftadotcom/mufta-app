// This file is located at: /server/trpc/routers/auth.ts

import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// --- Nodemailer Configuration ---
// These variables will be securely loaded from your Vercel environment settings.
// It's recommended to use a dedicated email for this (e.g., noreply@yourdomain.com)
// For testing, you can use a Gmail account with an "App Password".
const smtpHost = process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.EMAIL_SERVER_PORT || '465', 10);
const smtpUser = process.env.EMAIL_SERVER_USER || 'YOUR_GMAIL_ADDRESS';
const smtpPassword = process.env.EMAIL_SERVER_PASSWORD || 'YOUR_GMAIL_APP_PASSWORD';

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: true, // true for 465, false for other ports
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
});

export const authRouter = router({
  /**
   * Generates a 6-digit OTP, saves it to the user record, and sends it via Email.
   */
  sendOtp: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

      // Find or create the user by email
      await prisma.user.upsert({
        where: { email: input.email },
        update: { otp, otpExpires },
        create: { email: input.email, otp, otpExpires },
      });

      // Send the Email via Nodemailer
      try {
        await transporter.sendMail({
          from: `"Mufta" <${smtpUser}>`,
          to: input.email,
          subject: 'Your Mufta Verification Code',
          text: `Your verification code is: ${otp}`,
          html: `<b>Your verification code is: ${otp}</b><p>It is valid for 10 minutes.</p>`,
        });
        return { success: true, message: 'OTP sent to your email.' };
      } catch (error) {
        console.error("Nodemailer failed:", error);
        throw new Error("Failed to send OTP email.");
      }
    }),

  /**
   * Verifies the OTP provided by the user.
   */
  verifyOtp: publicProcedure
    .input(z.object({
      email: z.string().email(),
      otp: z.string().length(6),
    }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user || !user.otp || !user.otpExpires) {
        throw new Error("No OTP request found for this email.");
      }

      if (new Date() > user.otpExpires) {
        throw new Error("OTP has expired. Please request a new one.");
      }

      if (user.otp !== input.otp) {
        throw new Error("Invalid OTP provided.");
      }

      // OTP is correct. Mark user as verified and clear OTP fields.
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          otp: null,
          otpExpires: null,
        },
      });

      // In a real app, you would return a JWT session token here.
      return { success: true, message: "Email verified successfully!", user: updatedUser };
    }),
});
