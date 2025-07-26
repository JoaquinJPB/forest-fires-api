import { FastifyInstance } from "fastify";
import { TotalPaginated, Fire } from "../types/fireTypes";
import {
    DatasetResponse,
    fetchTyped,
    ResponseTyped,
} from "../utils/fetchTyped";
import { getTwoYearsAgoDate } from "../utils/helpers/dateHelper";

const API_BASE_URL =
    "https://analisis.datosabiertos.jcyl.es/api/explore/v2.1/catalog/datasets/incendios-forestales/records";

type GetPaginatedFiresResponse = Promise<ResponseTyped<TotalPaginated<Fire>>>;

export class FireService {
    constructor(private fastify: FastifyInstance) {}

    async getPaginatedFires(
        page: number = 1,
        page_size: number = 10
    ): GetPaginatedFiresResponse {
        const limit = page_size;
        const offset = (page - 1) * page_size;
        const startDate = getTwoYearsAgoDate();

        // Build API URL
        const url = `${API_BASE_URL}?limit=${limit}&offset=${offset}`;
        const response = await fetchTyped<DatasetResponse<Fire[]>>(url);

        if (response.success) {
            const paginatedResponse: TotalPaginated<Fire> = {
                page,
                page_size: limit,
                results: [...response.data.results],
                total: limit,
            };

            return {
                code: response.code,
                success: response.success,
                data: paginatedResponse,
            };
        }

        return response;
    }
}
