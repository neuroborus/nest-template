import { PrismaClient } from '@prisma/client';
import { PrismaDriverService } from '@/drivers/prisma/prisma-driver.service';
import { PrismaClientFactory } from '@/drivers/prisma/prisma-client-factory';

jest.mock('@/drivers/prisma/prisma-client-factory', () => ({
  PrismaClientFactory: jest.fn(),
}));

describe('PrismaDriverService', () => {
  let service: PrismaDriverService;
  let client: PrismaClient;
  let nextClient: PrismaClient;

  function createMockClient(): PrismaClient {
    return {
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined),
    } as unknown as PrismaClient;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    client = createMockClient();
    nextClient = createMockClient();
    (PrismaClientFactory as jest.Mock).mockReturnValue(nextClient);
    service = new PrismaDriverService(client);
  });

  it('connects and disconnects on module lifecycle', async () => {
    await expect(service.onModuleInit()).resolves.toBeUndefined();
    await expect(service.onModuleDestroy()).resolves.toBeUndefined();

    expect(client.$connect).toHaveBeenCalledTimes(1);
    expect(client.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('executes callback through useClient', async () => {
    const result = await service.useClient(async (usedClient) => {
      expect(usedClient).toBe(client);
      return 'ok';
    });

    expect(result).toBe('ok');
  });

  it('switches datasource and disconnects old client when idle', async () => {
    await expect(
      service.onDatasourceUrlChange('postgresql://next'),
    ).resolves.toBeUndefined();

    expect(PrismaClientFactory).toHaveBeenCalledWith('postgresql://next');
    expect(nextClient.$connect).toHaveBeenCalledTimes(1);
    expect(client.$disconnect).toHaveBeenCalledTimes(1);
    expect(service.client).toBe(nextClient);
  });

  it('defers old client disconnect until in-flight usage is done', async () => {
    let release: () => void;
    const inFlight = service.useClient(async () => {
      await new Promise<void>((resolve) => {
        release = resolve;
      });
      return undefined;
    });

    // Let useClient register the active usage before switching datasource.
    await Promise.resolve();

    await expect(
      service.onDatasourceUrlChange('postgresql://next'),
    ).resolves.toBeUndefined();

    expect(client.$disconnect).toHaveBeenCalledTimes(0);
    release!();
    await inFlight;

    expect(client.$disconnect).toHaveBeenCalledTimes(1);
    expect(service.client).toBe(nextClient);
  });
});
