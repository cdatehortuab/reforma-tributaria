import type {
  TablaMarginalUvt,
  TramoSmlmv,
  TramoUvt,
} from './params/constants';

/**
 * Impuesto o retención en UVT según la tabla marginal.
 * `desdeUvt` es inclusivo en 0 y exclusivo en el resto; `hastaUvt` es inclusivo.
 * Usa el `impuestoAcumuladoUvt` del tramo (la norma redondea el acumulado).
 */
export function aplicarTablaUvt(
  baseUvt: number,
  tabla: TablaMarginalUvt,
): number {
  if (!(baseUvt > 0)) {
    return 0;
  }

  for (const tramo of tabla.tramos) {
    if (isTramoUvt(baseUvt, tramo)) {
      return impuestoDelTramo(baseUvt, tramo);
    }
  }

  const ultimo = tabla.tramos.at(-1);
  return ultimo === undefined ? 0 : impuestoDelTramo(baseUvt, ultimo);
}

export const BordeHastaSmlmv = {
  INCLUSIVO: 'inclusivo',
  EXCLUSIVO: 'exclusivo',
} as const;

export type BordeHastaSmlmv =
  (typeof BordeHastaSmlmv)[keyof typeof BordeHastaSmlmv];

/**
 * Tramo en SMLMV. Salud del PL 477: `hastaSmlmv` inclusivo. FSP: exclusivo
 * («menor a»). Si el valor queda por encima del último tramo, se usa ese.
 */
export function buscarTramoSmlmv(
  valorSmlmv: number,
  tramos: readonly TramoSmlmv[],
  bordeHasta: BordeHastaSmlmv,
): TramoSmlmv | undefined {
  for (const tramo of tramos) {
    if (isTramoSmlmv(valorSmlmv, tramo, bordeHasta)) {
      return tramo;
    }
  }

  return tramos.at(-1);
}

function isTramoUvt(baseUvt: number, tramo: TramoUvt): boolean {
  return tramo.desdeUvt === 0 ?
      baseUvt <= tramo.hastaUvt
    : baseUvt > tramo.desdeUvt && baseUvt <= tramo.hastaUvt;
}

function impuestoDelTramo(baseUvt: number, tramo: TramoUvt): number {
  return tramo.impuestoAcumuladoUvt + (baseUvt - tramo.desdeUvt) * tramo.tarifa;
}

function isTramoSmlmv(
  valorSmlmv: number,
  tramo: TramoSmlmv,
  bordeHasta: BordeHastaSmlmv,
): boolean {
  if (bordeHasta === BordeHastaSmlmv.EXCLUSIVO) {
    return valorSmlmv >= tramo.desdeSmlmv && valorSmlmv < tramo.hastaSmlmv;
  }

  if (tramo.desdeSmlmv === 0) {
    return valorSmlmv <= tramo.hastaSmlmv;
  }

  return valorSmlmv > tramo.desdeSmlmv && valorSmlmv <= tramo.hastaSmlmv;
}
