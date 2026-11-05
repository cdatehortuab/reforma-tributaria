import { depurarCedula, PeriodoCedula } from './cedula';
import { aPesos, noNegativo, pesosAUvt, uvtAPesos } from './dinero';
import { MESES_DEL_ANIO, UVT_2026 } from './params/constants';
import { aplicarTablaUvt } from './tramos';

import type { ParametrosCedula } from './cedula';
import type { EntradaLaboral } from './entrada';
import type { TablaMarginalUvt } from './params/constants';
import type { ResultadoCalculo } from './resultado';

export interface ParametrosRenta extends ParametrosCedula {
  readonly tabla241: TablaMarginalUvt;
}

export interface ResultadoRenta extends ResultadoCalculo {
  readonly ingresosAnuales: number;
  readonly incrgo: number;
  readonly ingresoNeto: number;
  readonly baseGravable: number;
  readonly baseUvt: number;
}

/**
 * Impuesto de renta anual de la cédula general (ET arts. 206, 336 y 241).
 * Anualiza el mes típico × 12: no incluye prima de servicios ni cesantías.
 */
export function calcularRenta(
  entrada: EntradaLaboral,
  aportesObligatoriosMensual: number,
  params: ParametrosRenta,
): ResultadoRenta {
  const ingresosAnuales = aPesos(
    noNegativo(entrada.salarioMensual) * MESES_DEL_ANIO,
  );
  const depuracion = depurarCedula(
    {
      ingresos: ingresosAnuales,
      incrgo: aPesos(noNegativo(aportesObligatoriosMensual) * MESES_DEL_ANIO),
      personasACargo: entrada.personasACargo,
      interesesVivienda:
        noNegativo(entrada.interesesViviendaMensual) * MESES_DEL_ANIO,
      medicinaPrepagada:
        noNegativo(entrada.medicinaPrepagadaMensual) * MESES_DEL_ANIO,
      aportesVoluntariosPensionAfc:
        noNegativo(entrada.aportesVoluntariosPensionAfcMensual)
        * MESES_DEL_ANIO,
      periodo: PeriodoCedula.ANUAL,
    },
    params,
  );
  const baseUvt = pesosAUvt(depuracion.baseGravable, UVT_2026.valor);
  const impuestoUvt = aplicarTablaUvt(baseUvt, params.tabla241);
  const total = uvtAPesos(impuestoUvt, UVT_2026.valor);

  return {
    total,
    lineas: [
      ...depuracion.lineas,
      {
        concepto: 'Impuesto de renta',
        valor: total,
        articulo: params.tabla241.fuente.articulo,
        explicacion:
          'Tabla del art. 241 sobre la renta líquida gravable de la cédula general, expresada en UVT.',
      },
    ],
    ingresosAnuales,
    incrgo: depuracion.incrgo,
    ingresoNeto: depuracion.ingresoNeto,
    baseGravable: depuracion.baseGravable,
    baseUvt,
  };
}
