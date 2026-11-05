import { RegimenTributario } from '../entrada';

import { ACTUALIZADO_AL, DOCUMENTO_PL_477, URL_PL_477 } from './constants';

import type { ParametrosRenta } from '../renta';
import type { ParametrosRetencion } from '../retencion';
import type { ParametrosSalud } from '../salario';
import type { FuenteParametro } from './constants';

function fuentePl(articulo: string): FuenteParametro {
  return {
    articulo,
    documento: `${DOCUMENTO_PL_477} ${URL_PL_477}`,
    actualizadoAl: ACTUALIZADO_AL,
  };
}

/**
 * Parámetros del proyecto de ley 477 de 2026 (texto radicado).
 * Al enmendar el proyecto, actualizar este archivo, `ACTUALIZADO_AL` y
 * `docs/parametros.md`.
 *
 * El tipo que deben satisfacer lo define cada módulo del motor al
 * implementarse (`renta.ts`, `salario.ts`, …), no este archivo.
 */
export const proyecto = {
  regimen: RegimenTributario.PROYECTO,
  renta: {
    tabla241: {
      tramos: [
        {
          desdeUvt: 0,
          hastaUvt: 720,
          tarifa: 0,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 720,
          hastaUvt: 1090,
          tarifa: 0.09,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 1090,
          hastaUvt: 1700,
          tarifa: 0.19,
          impuestoAcumuladoUvt: 33,
        },
        {
          desdeUvt: 1700,
          hastaUvt: 4100,
          tarifa: 0.28,
          impuestoAcumuladoUvt: 149,
        },
        {
          desdeUvt: 4100,
          hastaUvt: 8670,
          tarifa: 0.33,
          impuestoAcumuladoUvt: 821,
        },
        {
          desdeUvt: 8670,
          hastaUvt: Infinity,
          tarifa: 0.39,
          impuestoAcumuladoUvt: 2329,
        },
      ],
      fuente: fuentePl('PL 477 art. 48 (ET art. 241)'),
    },
    rentaExentaLaboral: {
      porcentaje: 0.25,
      topeAnualUvt: 630,
      fuente: fuentePl('PL 477 art. 47 (ET art. 206 num. 10)'),
    },
    limiteExentasDeducciones: {
      porcentaje: 0.4,
      topeAnualUvt: 1180,
      fuente: fuentePl('PL 477 art. 49 (ET art. 336 num. 3 inc. 1)'),
    },
    dependientesAdicionales: {
      uvtPorDependiente: 0,
      maxDependientes: 0,
      fuente: fuentePl('PL 477 art. 106 (deroga ET art. 336 num. 3 inc. 2)'),
    },
  } as const satisfies ParametrosRenta,
  retencion: {
    tabla383: {
      tramos: [
        {
          desdeUvt: 0,
          hastaUvt: 65,
          tarifa: 0,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 65,
          hastaUvt: 95,
          tarifa: 0.09,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 95,
          hastaUvt: 150,
          tarifa: 0.19,
          impuestoAcumuladoUvt: 3,
        },
        {
          desdeUvt: 150,
          hastaUvt: 360,
          tarifa: 0.28,
          impuestoAcumuladoUvt: 13,
        },
        {
          desdeUvt: 360,
          hastaUvt: 640,
          tarifa: 0.33,
          impuestoAcumuladoUvt: 72,
        },
        {
          desdeUvt: 640,
          hastaUvt: Infinity,
          tarifa: 0.39,
          impuestoAcumuladoUvt: 164,
        },
      ],
      fuente: fuentePl('PL 477 art. 50 (ET art. 383)'),
    },
    independientesConCostos: {
      articuloRetencion: 'ET art. 392',
      fuente: fuentePl('PL 477 art. 50 par. 1'),
    },
  } as const satisfies ParametrosRetencion & {
    readonly independientesConCostos: {
      readonly articuloRetencion: string;
      readonly fuente: FuenteParametro;
    };
  },
  salud: {
    vigenciaDesde: '2027-01-01',
    tarifaEmpleador: 0.085,
    tramosEmpleado: [
      { desdeSmlmv: 0, hastaSmlmv: 2, tarifa: 0.04 },
      { desdeSmlmv: 2, hastaSmlmv: 4, tarifa: 0.055 },
      { desdeSmlmv: 4, hastaSmlmv: 5, tarifa: 0.06 },
      { desdeSmlmv: 5, hastaSmlmv: 10, tarifa: 0.065 },
      { desdeSmlmv: 10, hastaSmlmv: 15, tarifa: 0.07 },
      { desdeSmlmv: 15, hastaSmlmv: 20, tarifa: 0.075 },
      { desdeSmlmv: 20, hastaSmlmv: 25, tarifa: 0.08 },
    ],
    tramosIndependiente: [
      { desdeSmlmv: 0, hastaSmlmv: 2, tarifa: 0.125 },
      { desdeSmlmv: 2, hastaSmlmv: 4, tarifa: 0.13 },
      { desdeSmlmv: 4, hastaSmlmv: 5, tarifa: 0.135 },
      { desdeSmlmv: 5, hastaSmlmv: 10, tarifa: 0.14 },
      { desdeSmlmv: 10, hastaSmlmv: 15, tarifa: 0.145 },
      { desdeSmlmv: 15, hastaSmlmv: 20, tarifa: 0.15 },
      { desdeSmlmv: 20, hastaSmlmv: 25, tarifa: 0.155 },
    ],
    regimenesEspecialesYExcepcion: {
      recargoTrabajadorDesde2Hasta3Smlmv: 0.015,
      recargoTrabajadorMasDe3Smlmv: 0.025,
      tarifaEmpleador: 0.015,
    },
    fuente: fuentePl('PL 477 art. 21 (Ley 100 de 1993, art. 204)'),
  } as const satisfies ParametrosSalud & {
    readonly vigenciaDesde: string;
    readonly regimenesEspecialesYExcepcion: {
      readonly recargoTrabajadorDesde2Hasta3Smlmv: number;
      readonly recargoTrabajadorMasDe3Smlmv: number;
      readonly tarifaEmpleador: number;
    };
  },
  aportesPatronales: {
    vigenciaDesde: '2027-01-01',
    exoneracionHastaSmlmv: 2,
    tarifaParcial: {
      desdeSmlmv: 2,
      hastaSmlmv: 3,
      sena: 0.01,
      icbf: 0.01,
      salud: 0.04,
    },
    fuente: fuentePl('PL 477 art. 20 (ET art. 114-1) y art. 21 par. 4'),
  },
  efectiva: {
    vigenciaDesde: '2028-01-01',
    topeMensualUvt: 5.5,
    porPersona: true,
    periodoMaximoDias: 15,
    tramos: [
      {
        categoria: 'pobreza-extrema',
        proporcion: 1,
        montoMinimo: true,
      },
      {
        categoria: 'pobreza',
        proporcion: 1,
        montoMinimo: false,
      },
      {
        categoria: 'vulnerabilidad-tramo-menor-ingreso',
        proporcion: 1,
        montoMinimo: false,
      },
      {
        categoria: 'vulnerabilidad-tramo-2',
        proporcion: 0.5,
        montoMinimo: false,
      },
      {
        categoria: 'vulnerabilidad-tramo-3',
        proporcion: 0.4,
        montoMinimo: false,
      },
      {
        categoria: 'vulnerabilidad-tramo-4',
        proporcion: 0.3,
        montoMinimo: false,
      },
    ],
    mapeoInstrumentoFocalizacion: 'pendiente-dnp-minhacienda',
    fuente: fuentePl('PL 477 arts. 38 a 40'),
  },
  patrimonio: {
    vigenciaDesde: '2027-01-01',
    periodosGravables: [2027, 2028, 2029, 2030],
    umbralUvt: 95_500,
    tabla: {
      tramos: [
        {
          desdeUvt: 0,
          hastaUvt: 95_500,
          tarifa: 0,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 95_500,
          hastaUvt: 145_500,
          tarifa: 0.005,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 145_500,
          hastaUvt: Infinity,
          tarifa: 0.01,
          impuestoAcumuladoUvt: 250,
        },
      ],
      fuente: fuentePl('PL 477 arts. 66 a 68 (ET arts. 292-3, 294-3 y 296-3)'),
    },
  },
} as const;

export type ParametrosProyecto = typeof proyecto;
