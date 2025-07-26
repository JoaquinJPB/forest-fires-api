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
  fecha_extinguido: unknown | null;
  hora_extinguido: unknown | null;
  codigo_municipio_ine: unknown | null;
  nivel_maximo_alcanzado: unknown | null;
  posicion: unknown | null;
  orden: string;
}

export interface TotalPaginated<T> {
  results: T[];
  page: number;
  page_size: number;
  total_current_page: number;
  total_pages: number;
  total: number;
}
