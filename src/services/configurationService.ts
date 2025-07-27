import { prisma } from "../prisma";

export class ConfigurationService {
  async saveConfiguration(config: { userId: number; province?: string; probableCause?: string; status?: string; severity?: string }) {
    if (config.userId == null || typeof config.userId !== "number") {
      throw new Error("userId is required and must be a number");
    }

    const saved = await prisma.filterConfiguration.create({ data: config });
    return saved;
  }

  async getConfigurationsByUserId(userId: number) {
    const configs = await prisma.filterConfiguration.findMany({
      where: { userId },
    });

    if (configs.length === 0) {
      throw new Error("No configurations found");
    }

    return configs;
  }
}
