import { FastifyInstance } from "fastify";
import { TotalPaginated, Fire } from "../types/fireTypes";
import { DatasetResponse, fetchTyped, ResponseTyped } from "../utils/fetchTyped";
import { getTwoYearsAgoDate } from "../utils/helpers/dateHelper";

const API_BASE_URL = "https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/incendios-forestales/records";

type GetPaginatedFiresResponse = Promise<ResponseTyped<TotalPaginated<Fire>>>;

export class FireService {
  constructor(private fastify: FastifyInstance) {}

  async getPaginatedFires(page: number, limit: number): GetPaginatedFiresResponse {
    const offset = (page - 1) * limit;
    const startDate = getTwoYearsAgoDate();

    // Build API URL
    const params = new URLSearchParams();
    params.append("limit", `${limit}`);
    params.append("offset", `${offset}`);
    params.append("where", `fecha_de_inicio>='${startDate}'`);
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
}
