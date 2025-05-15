import { PrismaUniDriver } from './prisma.types';

type TxCallback<T> = (tx: PrismaUniDriver) => Promise<T>;

export async function runTransaction<T>(
  prisma: PrismaUniDriver,
  fn: TxCallback<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    return fn(tx as PrismaUniDriver);
  });
}
