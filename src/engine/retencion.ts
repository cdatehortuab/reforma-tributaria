import { cuposCedulaIniciales, depurarCedula, PeriodoCedula } from './cedula';
import { pesosAUvt, uvtAPesos } from './dinero';
import { MESES_DEL_ANIO, UVT_2026 } from './params/constants';
import { aplicarTablaUvt } from './tramos';

import type { CuposCedula, ParametrosCedula } from './cedula';
import type { EntradaLaboral } from './entrada';
import type { TablaMarginalUvt } from './params/constants';
import type { ResultadoCalculo } from './resultado';

export interface ParametrosRetencion {
  readonly tabla383: TablaMarginalUvt;
}

export interface ResultadoRetencion extends ResultadoCalculo {
  readonly ingresos: number;
  readonly incrgo: number;
  readonly ingresoNeto: number;
  readonly baseGravable: number;
  readonly baseUvt: number;
  readonly cuposRestantes: CuposCedula;
}

export interface MesRetencion {
  readonly mes: number;
  readonly retencion: ResultadoRetencion;
}

export interface ProyeccionRetencion {
  readonly meses: readonly MesRetencion[];
  readonly retencionConCupo: ResultadoRetencion;
  readonly retencionTrasAgotarCupos: ResultadoRetencion;
  readonly mesEnQueAumenta: number | undefined;
  readonly mesEnQueSeAgota25: number | undefined;
  readonly mesEnQueSeAgotaGlobal: number | undefined;
}

/**
 * Retención en la fuente, procedimiento 1 (ET arts. 383, 385 y 388).
 * Sin `cuposRestantes` equivale a enero: cupos anuales llenos. El 25 % y el
 * tope global (1.340 / 1.180 UVT) se descuentan de esos cupos, no se
 * prorratean ÷ 12. El 40 % del art. 388 sigue siendo de ese mes.
 */
export function calcularRetencion(
  entrada: EntradaLaboral,
  aportesObligatoriosMensual: number,
  params: ParametrosRetencion,
  cedula: ParametrosCedula,
  cuposRestantes: CuposCedula = cuposCedulaIniciales(cedula),
): ResultadoRetencion {
  const depuracion = depurarCedula(
    {
      ingresos: entrada.salarioMensual,
      incrgo: aportesObligatoriosMensual,
      personasACargo: entrada.personasACargo,
      interesesVivienda: entrada.interesesViviendaMensual,
      medicinaPrepagada: entrada.medicinaPrepagadaMensual,
      aportesVoluntariosPensionAfc: entrada.aportesVoluntariosPensionAfcMensual,
      periodo: PeriodoCedula.MENSUAL,
    },
    cedula,
    cuposRestantes,
  );
  const baseUvt = pesosAUvt(depuracion.baseGravable, UVT_2026.valor);
  const retencionUvt = aplicarTablaUvt(baseUvt, params.tabla383);
  const total = uvtAPesos(retencionUvt, UVT_2026.valor);

  return {
    total,
    lineas: [
      ...depuracion.lineas,
      {
        concepto: 'Retención en la fuente',
        valor: total,
        articulo: params.tabla383.fuente.articulo,
        explicacion:
          'Tabla del art. 383 sobre la base depurada en UVT. Procedimiento 1: se mira el mes, no el promedio semestral.',
      },
    ],
    ingresos: depuracion.ingresos,
    incrgo: depuracion.incrgo,
    ingresoNeto: depuracion.ingresoNeto,
    baseGravable: depuracion.baseGravable,
    baseUvt,
    cuposRestantes: depuracion.cuposRestantes,
  };
}

/**
 * Doce meses iguales, arrastrando los cupos anuales del 25 % y del tope
 * global. No incluye prima de servicios: en la vida real el salto puede
 * llegar un mes antes. `retencionConCupo` es enero; el aviso de la UI
 * usa `mesEnQueAumenta`.
 */
export function proyectarRetencion(
  entrada: EntradaLaboral,
  aportesObligatoriosMensual: number,
  params: ParametrosRetencion,
  cedula: ParametrosCedula,
): ProyeccionRetencion {
  const meses: MesRetencion[] = [];
  let cupos = cuposCedulaIniciales(cedula);

  for (let mes = 1; mes <= MESES_DEL_ANIO; mes += 1) {
    const retencion = calcularRetencion(
      entrada,
      aportesObligatoriosMensual,
      params,
      cedula,
      cupos,
    );
    cupos = retencion.cuposRestantes;
    meses.push({ mes, retencion });
  }

  const primero = mesEn(meses, 0);
  const ultimo = mesEn(meses, meses.length - 1);
  const mesEnQueAumenta = meses.find(
    (item) => item.retencion.total > primero.retencion.total,
  )?.mes;
  const mesEnQueSeAgota25 = meses.find(
    (item) => item.retencion.cuposRestantes.rentaExentaLaboral25 === 0,
  )?.mes;
  const mesEnQueSeAgotaGlobal = meses.find(
    (item) => item.retencion.cuposRestantes.limiteGlobal === 0,
  )?.mes;

  return {
    meses,
    retencionConCupo: primero.retencion,
    retencionTrasAgotarCupos: ultimo.retencion,
    mesEnQueAumenta,
    mesEnQueSeAgota25,
    mesEnQueSeAgotaGlobal,
  };
}

function mesEn(meses: readonly MesRetencion[], indice: number): MesRetencion {
  const item = meses[indice];
  if (item === undefined) {
    throw new Error(
      `No hay mes de retención en el índice ${indice.toString()}.`,
    );
  }
  return item;
}
