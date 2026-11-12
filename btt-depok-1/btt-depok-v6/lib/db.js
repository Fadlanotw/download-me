import { PrismaClient } from '@prisma/client';
export const prisma = globalThis.__p || (globalThis.__p = new PrismaClient());
