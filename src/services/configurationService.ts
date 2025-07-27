import { prisma } from "../prisma";
import { cache } from "../cache";

export class ConfigurationService {
  async saveConfiguration(config: { userId: number; province?: string; probableCause?: string; status?: string; severity?: string }) {
    if (config.userId == null || typeof config.userId !== "number") {
      throw new Error("userId is required and must be a number");
    }

    const saved = await prisma.filterConfiguration.create({ data: config });

    const cacheKey = `configurations:${config.userId}`;
    cache.del(cacheKey);

    return saved;
  }

  async getConfigurationsByUserId(userId: number) {
    const cacheKey = `configurations:${userId}`;
    const cached = cache.get<(typeof prisma.filterConfiguration)[]>(cacheKey);
    if (cached) return cached;

    const configs = await prisma.filterConfiguration.findMany({
      where: { userId },
    });

    if (configs.length === 0) {
      throw new Error("No configurations found");
    }

    cache.set(cacheKey, configs, 60);
    return configs;
  }
}
