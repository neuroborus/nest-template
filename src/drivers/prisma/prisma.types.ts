export * as Prisma from '@prisma/client';
import { PrismaClient, Prisma } from '@prisma/client';

export type PrismaDriver<
  Name extends Exclude<keyof PrismaClient, `$${string}`>,
> = {
  [name in Name]: PrismaClient[Name];
} & {
  $queryRaw: PrismaClient['$queryRaw'];

  $queryRawUnsafe: PrismaClient['$queryRawUnsafe'];

  $executeRaw: PrismaClient['$executeRaw'];

  $executeRawUnsafe: PrismaClient['$executeRawUnsafe'];

  $transaction?: PrismaClient['$transaction'];
};

export type PrismaOperation =
  Prisma.Args<any, any> extends Prisma.Args<any, infer U> ? U : never;

export type PrismaArgs<
  Model extends Exclude<keyof PrismaClient, `$${string}`>,
  Op extends PrismaOperation,
> = Prisma.Args<PrismaClient[Model], Op>;
