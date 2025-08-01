// server/trpc/context.ts

import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import { prisma } from '../db';

/**
 * Creates context for an incoming request.
 * This function now fetches the user session and includes it.
 * @link https://trpc.io/docs/context
 */
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req } = opts;

  // Get the session from the request using your auth library
  const session = await getSession({ req });

  // Return the context object with both prisma and the session
  return {
    prisma,
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
