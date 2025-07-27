import { ConfigurationService } from "../../services/configurationService";
import { prisma } from "../../prisma";
import { cache } from "../../cache";

jest.mock("../../prisma", () => ({
  prisma: {
    filterConfiguration: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock("../../cache", () => ({
  cache: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

describe("ConfigurationService", () => {
  let service: ConfigurationService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ConfigurationService();
  });

  describe("saveConfiguration", () => {
    it("saves configuration and clears cache", async () => {
      const mockConfig = { userId: 42, province: "LEÓN" };
      const mockSaved = { id: 1, ...mockConfig };
      (prisma.filterConfiguration.create as jest.Mock).mockResolvedValue(mockSaved);

      const result = await service.saveConfiguration(mockConfig);

      expect(prisma.filterConfiguration.create).toHaveBeenCalledWith({ data: mockConfig });
      expect(cache.del).toHaveBeenCalledWith(`configurations:${mockConfig.userId}`);
      expect(result).toEqual(mockSaved);
    });

    it("throws error if userId is invalid", async () => {
      // @ts-expect-error: testing invalid input
      await expect(service.saveConfiguration({ userId: "42", province: "LEÓN" })).rejects.toThrow("userId is required and must be a number");
    });
  });

  describe("getConfigurationsByUserId", () => {
    it("returns cached configurations if available", async () => {
      const mockCached = [{ id: 1, userId: 42 }];
      (cache.get as jest.Mock).mockReturnValue(mockCached);

      const result = await service.getConfigurationsByUserId(42);

      expect(cache.get).toHaveBeenCalledWith("configurations:42");
      expect(prisma.filterConfiguration.findMany).not.toHaveBeenCalled();
      expect(result).toEqual(mockCached);
    });

    it("fetches configurations from DB and caches them if not in cache", async () => {
      (cache.get as jest.Mock).mockReturnValue(undefined);
      const mockConfigs = [{ id: 1, userId: 42, province: "LEÓN" }];
      (prisma.filterConfiguration.findMany as jest.Mock).mockResolvedValue(mockConfigs);

      const result = await service.getConfigurationsByUserId(42);

      expect(prisma.filterConfiguration.findMany).toHaveBeenCalledWith({ where: { userId: 42 } });
      expect(cache.set).toHaveBeenCalledWith("configurations:42", mockConfigs, 60);
      expect(result).toEqual(mockConfigs);
    });

    it("throws error if no configurations are found", async () => {
      (cache.get as jest.Mock).mockReturnValue(undefined);
      (prisma.filterConfiguration.findMany as jest.Mock).mockResolvedValue([]);

      await expect(service.getConfigurationsByUserId(42)).rejects.toThrow("No configurations found");
    });
  });
});
