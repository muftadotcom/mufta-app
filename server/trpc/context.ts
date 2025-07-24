// File: /server/trpc/context.ts
// Description: This file defines the context for your API, including the Prisma client.
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
export const createContext = () => {
  return {
    prisma,
  };
};
export type Context = ReturnType<typeof createContext>;