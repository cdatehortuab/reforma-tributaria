export const TipoSalario = {
  ORDINARIO: 'ordinario',
  INTEGRAL: 'integral',
} as const;

export type TipoSalario = (typeof TipoSalario)[keyof typeof TipoSalario];

export const RegimenTributario = {
  VIGENTE: 'vigente',
  PROYECTO: 'proyecto',
} as const;

export type RegimenTributario =
  (typeof RegimenTributario)[keyof typeof RegimenTributario];

/**
 * Entrada mensual del módulo laboral. Los ceros significan «no aplica».
 * `personasACargo` es un entero: el 10 % del art. 387 procede si hay al menos
 * una; los 72 UVT del art. 336 se cuentan por persona, hasta el máximo legal.
 */
export interface EntradaLaboral {
  readonly salarioMensual: number;
  readonly tipoSalario: TipoSalario;
  readonly personasACargo: number;
  readonly interesesViviendaMensual: number;
  readonly medicinaPrepagadaMensual: number;
  readonly aportesVoluntariosPensionAfcMensual: number;
}
