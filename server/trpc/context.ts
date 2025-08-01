import { getSession } from 'next-auth/react';
import { prisma } from '../db';
import { headers } from 'next/headers';

/**
 * Creates context for an incoming request.
 * This function is now framework-agnostic.
 */
export const createContext = async () => {
  const session = await getSession({
    req: {
      headers: Object.fromEntries(headers()),
    },
  });

  return {
    prisma,
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;