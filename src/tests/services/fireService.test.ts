import { FireService } from "../../services/fireService";
import { cache } from "../../cache";
import { FilteredFieldsEnum } from "../../types/fireTypes";
import { fetchTyped } from "../../utils/fetchTyped";

jest.mock("../../utils/helpers/dateHelper", () => ({
  getTwoYearsAgoDate: () => "2023-07-27",
}));
jest.mock("../../utils/fetchTyped", () => ({
  fetchTyped: jest.fn().mockResolvedValue({
    success: true,
    data: {
      total_count: 4155,
      results: [
        {
          fecha_del_parte: "2025-07-27",
          hora_del_parte: "19:00",
          provincia: ["PALENCIA"],
          causa_probable: "EN INVESTIGACION",
          termino_municipal: "POMAR DE VALDIVIA",
          nivel: "0",
          fecha_de_inicio: "2025-07-27",
          hora_de_inicio: "14:50",
          medios_de_extincion: "1 A.M.;1 HT-VILLAELES;1 ELIF;2 Autobombas;1 Cuadrillas de tierra;2 Dotación de Bomberos diputación;1 Guardia Civil",
          situacion_actual: "ACTIVO",
          tipo_y_has_de_superficie_afectada: "EN PERIMETRACION",
          fecha_extinguido: null,
          hora_extinguido: null,
          codigo_municipio_ine: "34135",
          nivel_maximo_alcanzado: "0",
          posicion: {
            lon: -4.16749,
            lat: 42.774579,
          },
          orden: "2025-07-27 19:00 PALENCIA",
        },
      ],
    },
  }),
}));
jest.mock("../../cache", () => ({
  cache: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

describe("FireService", () => {
  const fastifyMock = {} as any;
  const fireService = new FireService(fastifyMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getPaginatedFires returns the expected structure and caches the result.", async () => {
    (cache.get as jest.Mock).mockReturnValue(undefined);

    const result = await fireService.getPaginatedFires(1, 1);

    if (!result.success) {
      throw new Error("Expected success to be true");
    }

    expect(result.success).toBe(true);
    expect(result.data.page).toBe(1);
    expect(result.data.page_size).toBe(1);
    expect(result.data.total_current_page).toBe(1);
    expect(result.data.total_pages).toBe(4155);
    expect(result.data.total).toBe(4155);
    expect(Array.isArray(result.data.results)).toBe(true);
    expect(result.data.results[0]).toMatchObject({
      fecha_del_parte: "2025-07-27",
      hora_del_parte: "19:00",
      provincia: ["PALENCIA"],
      causa_probable: "EN INVESTIGACION",
      termino_municipal: "POMAR DE VALDIVIA",
      nivel: "0",
      fecha_de_inicio: "2025-07-27",
      hora_de_inicio: "14:50",
      medios_de_extincion: expect.any(String),
      situacion_actual: "ACTIVO",
      tipo_y_has_de_superficie_afectada: "EN PERIMETRACION",
      fecha_extinguido: null,
      hora_extinguido: null,
      codigo_municipio_ine: "34135",
      nivel_maximo_alcanzado: "0",
      posicion: {
        lon: -4.16749,
        lat: 42.774579,
      },
      orden: "2025-07-27 19:00 PALENCIA",
    });
    expect(cache.set).toHaveBeenCalled();
  });

  it("getFilteredPaginatedFires returns the expected structure and caches the result.", async () => {
    (cache.get as jest.Mock).mockReturnValue(undefined);

    const filters = {
      [FilteredFieldsEnum.PROVINCE]: "PALENCIA",
      [FilteredFieldsEnum.PROBABLE_CAUSE]: "EN INVESTIGACION",
      [FilteredFieldsEnum.CURRENT_STATUS]: "ACTIVO",
      [FilteredFieldsEnum.MAXIMUM_LEVEL]: "0",
    };

    const result = await fireService.getFilteredPaginatedFires(1, 1, filters);

    if (!result.success) {
      throw new Error("Expected success to be true");
    }

    expect(result.success).toBe(true);
    expect(result.data.page).toBe(1);
    expect(result.data.page_size).toBe(1);
    expect(result.data.total_current_page).toBe(1);
    expect(result.data.total_pages).toBe(4155);
    expect(result.data.total).toBe(4155);
    expect(Array.isArray(result.data.results)).toBe(true);
    expect(result.data.results[0]).toMatchObject({
      provincia: ["PALENCIA"],
      causa_probable: "EN INVESTIGACION",
      situacion_actual: "ACTIVO",
      nivel_maximo_alcanzado: "0",
    });
    expect(cache.set).toHaveBeenCalled();
  });

  it("getNearbyFires returns the expected structure and caches the result.", async () => {
    (cache.get as jest.Mock).mockReturnValue(undefined);

    // Parámetros de
    const radius = 1000;
    const lat = 42.56918;
    const lon = -5.682925;
    const page = 1;
    const limit = 1;

    (fetchTyped as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: {
        total_count: 54,
        results: [
          {
            fecha_del_parte: "2025-07-26",
            hora_del_parte: "19:00",
            provincia: ["LEÓN"],
            causa_probable: "ACCIDENTAL (FUMADORES)",
            termino_municipal: "CEMBRANOS(CHOZAS DE ABAJO)",
            nivel: "0",
            fecha_de_inicio: "2025-07-24",
            hora_de_inicio: "11:53",
            medios_de_extincion: "1 A.M.",
            situacion_actual: "EXTINGUIDO",
            tipo_y_has_de_superficie_afectada: "FORESTAL:PASTO:0,01 HA. ;",
            fecha_extinguido: "2025-07-24",
            hora_extinguido: "12:50",
            codigo_municipio_ine: "24065",
            nivel_maximo_alcanzado: "0",
            posicion: {
              lon: -5.687187,
              lat: 42.506675,
            },
            orden: "2025-07-26 19:00 LEÓN",
          },
        ],
      },
    });

    const result = await fireService.getNearbyFires(radius, lat, lon, page, limit);

    if (!result.success) {
      throw new Error("Expected success to be true");
    }

    expect(result.success).toBe(true);
    expect(result.data.page).toBe(1);
    expect(result.data.page_size).toBe(1);
    expect(result.data.total_current_page).toBe(1);
    expect(result.data.total_pages).toBe(54);
    expect(result.data.total).toBe(54);
    expect(Array.isArray(result.data.results)).toBe(true);
    expect(result.data.results[0]).toMatchObject({
      fecha_del_parte: "2025-07-26",
      hora_del_parte: "19:00",
      provincia: ["LEÓN"],
      causa_probable: "ACCIDENTAL (FUMADORES)",
      termino_municipal: "CEMBRANOS(CHOZAS DE ABAJO)",
      nivel: "0",
      fecha_de_inicio: "2025-07-24",
      hora_de_inicio: "11:53",
      medios_de_extincion: "1 A.M.",
      situacion_actual: "EXTINGUIDO",
      tipo_y_has_de_superficie_afectada: "FORESTAL:PASTO:0,01 HA. ;",
      fecha_extinguido: "2025-07-24",
      hora_extinguido: "12:50",
      codigo_municipio_ine: "24065",
      nivel_maximo_alcanzado: "0",
      posicion: {
        lon: -5.687187,
        lat: 42.506675,
      },
      orden: "2025-07-26 19:00 LEÓN",
      distancia_desde_origen: {
        type: "km",
        value: expect.any(Number),
      },
    });
    expect(cache.set).toHaveBeenCalled();
  });
});
