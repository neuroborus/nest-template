export * as Prisma from '@prisma/client';
import { PrismaClient, Prisma } from '@prisma/client';

type BareMethods = {
  $queryRaw: PrismaClient['$queryRaw'];

  $queryRawUnsafe: PrismaClient['$queryRawUnsafe'];

  $executeRaw: PrismaClient['$executeRaw'];

  $executeRawUnsafe: PrismaClient['$executeRawUnsafe'];

  $transaction?: PrismaClient['$transaction'];
};

export type PrismaDriver<
  Name extends Exclude<keyof PrismaClient, `$${string}`>,
> = {
  [name in Name]: PrismaClient[Name];
} & BareMethods;

// Allows to make cross-tables transactions
export type PrismaUniDriver = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on'
> &
  BareMethods;

export type PrismaOperation =
  Prisma.Args<any, any> extends Prisma.Args<any, infer U> ? U : never;

export type PrismaArgs<
  Model extends Exclude<keyof PrismaClient, `$${string}`>,
  Op extends PrismaOperation,
> = Prisma.Args<PrismaClient[Model], Op>;
