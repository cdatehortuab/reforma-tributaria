/** Fuente de un parámetro numérico del motor, para citar artículo y documento. */
export interface FuenteParametro {
  readonly articulo: string;
  readonly documento: string;
  readonly actualizadoAl: string;
}

export interface ParametroNumerico {
  readonly valor: number;
  readonly fuente: FuenteParametro;
}

/**
 * UVT, SMLMV y demás constantes oficiales se documentan en
 * `docs/parametros.md` y se cargan aquí cuando el motor de reglas se implemente.
 * No inventar cifras: verificar la resolución DIAN / decreto vigentes.
 */
export const PARAMETROS_PENDIENTES =
  'Valores oficiales de UVT y SMLMV 2026 pendientes de verificación.' as const;

/** Estado del PL 477; se muestra junto a la fecha «actualizado al». */
export const ESTADO_PROYECTO = 'en trámite' as const;
