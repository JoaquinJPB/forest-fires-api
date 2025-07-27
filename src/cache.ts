import NodeCache from "node-cache";

export const cache = new NodeCache({
  stdTTL: 60, // duración por defecto: 60 segundos
  checkperiod: 120, // limpia entradas expiradas cada 2 minutos
});
