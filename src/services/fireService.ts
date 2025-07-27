import { FastifyInstance } from "fastify";
import { TotalPaginated, Fire, FilteredFieldsEnum } from "../types/fireTypes";
import { DatasetResponse, fetchTyped, ResponseTyped } from "../utils/fetchTyped";
import { getTwoYearsAgoDate } from "../utils/helpers/dateHelper";

const API_BASE_URL = "https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/incendios-forestales/records";

type GetPaginatedFiresResponse = Promise<ResponseTyped<TotalPaginated<Fire>>>;

export class FireService {
  constructor(private fastify: FastifyInstance) {}

  private async fetchPaginatedFires(page: number, limit: number, whereConditions: string[]): GetPaginatedFiresResponse {
    const offset = (page - 1) * limit;
    const params = new URLSearchParams();
    params.append("limit", `${limit}`);
    params.append("offset", `${offset}`);
    params.append("where", whereConditions.join(" and "));
    params.append("order_by", `fecha_de_inicio DESC`);

    const response = await fetchTyped<DatasetResponse<Fire[]>>(`${API_BASE_URL}?${params}`);

    if (response.success) {
      const totalRecords = response.data.total_count;
      const totalPages = Math.ceil(totalRecords / limit);
      const currentPageCount = response.data.results.length;

      const paginatedResponse: TotalPaginated<Fire> = {
        page,
        page_size: limit,
        total_current_page: currentPageCount,
        results: [...response.data.results],
        total_pages: totalPages,
        total: totalRecords,
      };

      return {
        ...response,
        data: paginatedResponse,
      };
    }

    return response;
  }

  async getPaginatedFires(page: number, limit: number): GetPaginatedFiresResponse {
    const startDate = getTwoYearsAgoDate();
    const whereConditions = [`fecha_de_inicio>='${startDate}'`];
    return this.fetchPaginatedFires(page, limit, whereConditions);
  }

  async getFilteredPaginatedFires(page: number, limit: number, filters: Record<FilteredFieldsEnum, string>): GetPaginatedFiresResponse {
    const startDate = getTwoYearsAgoDate();
    const whereConditions = [`fecha_de_inicio>='${startDate}'`];
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        whereConditions.push(`${key}='${value}'`);
      }
    });
    return this.fetchPaginatedFires(page, limit, whereConditions);
  }

  async getNearbyFires(radius: number, lat: number, lon: number, page: number, limit: number): GetPaginatedFiresResponse {
    const startDate = getTwoYearsAgoDate();
    const radiusInMeters = radius * 1000;

    const whereConditions = [`fecha_de_inicio>='${startDate}'`, `within_distance(posicion, geom'POINT(${lon} ${lat})', ${radiusInMeters})`];
    return this.fetchPaginatedFires(page, limit, whereConditions);
  }
}
