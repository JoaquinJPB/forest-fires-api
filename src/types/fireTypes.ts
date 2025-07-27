export interface Fire {
  fecha_del_parte: string;
  hora_del_parte: string;
  provincia: string[];
  causa_probable: string;
  termino_municipal: string;
  nivel: string;
  fecha_de_inicio: string;
  hora_de_inicio: string;
  medios_de_extincion: string;
  situacion_actual: string;
  tipo_y_has_de_superficie_afectada: string;
  fecha_extinguido: string | null;
  hora_extinguido: string | null;
  codigo_municipio_ine: string;
  nivel_maximo_alcanzado: string;
  posicion: Position;
  orden: string;
}

export interface Position {
  lat: number;
  lon: number;
}

export interface TotalPaginated<T> {
  results: T[];
  page: number;
  page_size: number;
  total_current_page: number;
  total_pages: number;
  total: number;
}

export enum FilteredFieldsEnum {
  PROVINCE = "provincia",
  PROBABLE_CAUSE = "causa_probable",
  CURRENT_STATUS = "situacion_actual",
  MAXIMUM_LEVEL = "nivel_maximo_alcanzado",
}

export interface FireNearby extends Fire {
  distancia_desde_origen: {
    type: "km" | "m";
    value: number;
  };
}
