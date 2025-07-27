import { FastifyInstance } from "fastify";
import { TotalPaginated, Fire, FilteredFieldsEnum, FireNearby } from "../types/fireTypes";
import { DatasetResponse, fetchTyped, ResponseTyped } from "../utils/fetchTyped";
import { getTwoYearsAgoDate } from "../utils/helpers/dateHelper";
import { haversineDistanceKm } from "../utils/helpers/haversineHelper";
import { cache } from "../cache";

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

    const cacheKey = `fires:page=${page}:limit=${limit}`;

    const cached = cache.get<GetPaginatedFiresResponse>(cacheKey);
    if (cached) return cached;

    const response = await this.fetchPaginatedFires(page, limit, whereConditions);
    if (response.success) {
      cache.set(cacheKey, response, 60);
    }

    return response;
  }

  async getFilteredPaginatedFires(page: number, limit: number, filters: Record<FilteredFieldsEnum, string>): GetPaginatedFiresResponse {
    const startDate = getTwoYearsAgoDate();
    const whereConditions = [`fecha_de_inicio>='${startDate}'`];

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        whereConditions.push(`${key}='${value}'`);
      }
    });

    const cacheKey = `fires:filtered:${page}:${limit}:${JSON.stringify(filters)}`;
    const cached = cache.get<GetPaginatedFiresResponse>(cacheKey);
    if (cached) return cached;

    const response = await this.fetchPaginatedFires(page, limit, whereConditions);
    if (response.success) {
      cache.set(cacheKey, response, 60);
    }

    return response;
  }

  async getNearbyFires(radius: number, lat: number, lon: number, page: number, limit: number): GetPaginatedFiresResponse {
    const startDate = getTwoYearsAgoDate();
    const radiusInMeters = radius * 1000;
    const whereConditions = [`fecha_de_inicio>='${startDate}'`, `within_distance(posicion, geom'POINT(${lon} ${lat})', ${radiusInMeters})`];

    const cacheKey = `fires:nearby:${radius}:${lat}:${lon}:${page}:${limit}`;
    const cached = cache.get<GetPaginatedFiresResponse>(cacheKey);
    if (cached) return cached;

    const paginatedFiresResponse = await this.fetchPaginatedFires(page, limit, whereConditions);

    if (!paginatedFiresResponse.success) {
      return paginatedFiresResponse;
    }

    const nearbyFires: FireNearby[] = paginatedFiresResponse.data.results.map((fire) => ({
      ...fire,
      distancia_desde_origen: {
        type: "km",
        value: haversineDistanceKm(lat, lon, fire.posicion.lat, fire.posicion.lon),
      },
    }));

    const response = {
      ...paginatedFiresResponse,
      data: {
        ...paginatedFiresResponse.data,
        results: nearbyFires,
      },
    };

    cache.set(cacheKey, response, 60);
    return response;
  }
}
