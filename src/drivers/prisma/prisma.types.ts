export * as Prisma from '@prisma/client';
import { PrismaClient, Prisma } from '@prisma/client';

type PrismaTxClient = Prisma.TransactionClient;

type BareMethods = {
  $queryRaw: PrismaTxClient['$queryRaw'];

  $queryRawUnsafe: PrismaTxClient['$queryRawUnsafe'];

  $executeRaw: PrismaTxClient['$executeRaw'];

  $executeRawUnsafe: PrismaTxClient['$executeRawUnsafe'];

  $transaction?: PrismaClient['$transaction'];
};

export type PrismaDriver<
  Name extends Exclude<keyof PrismaTxClient, `$${string}`>,
> = {
  [name in Name]: PrismaTxClient[Name];
} & BareMethods;

// Allows to make cross-tables transactions
export type PrismaUniDriver = PrismaClient & BareMethods;

export type PrismaOperation =
  Prisma.Args<any, any> extends Prisma.Args<any, infer U> ? U : never;

export type PrismaArgs<
  Model extends Exclude<keyof PrismaTxClient, `$${string}`>,
  Op extends PrismaOperation,
> = Prisma.Args<PrismaTxClient[Model], Op>;
