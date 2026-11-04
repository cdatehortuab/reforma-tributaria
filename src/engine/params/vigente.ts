import { ACTUALIZADO_AL } from './constants';

/**
 * Parámetros de la normativa vigente (Estatuto Tributario y Ley 100).
 * Cada cifra cita artículo y documento. Ver `docs/parametros.md`.
 *
 * El tipo que deben satisfacer lo define cada módulo del motor al
 * implementarse (`renta.ts`, `salario.ts`, …), no este archivo.
 */
export const vigente = {
  regimen: 'vigente',
  renta: {
    tabla241: {
      tramos: [
        {
          desdeUvt: 0,
          hastaUvt: 1090,
          tarifa: 0,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 1090,
          hastaUvt: 1700,
          tarifa: 0.19,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 1700,
          hastaUvt: 4100,
          tarifa: 0.28,
          impuestoAcumuladoUvt: 116,
        },
        {
          desdeUvt: 4100,
          hastaUvt: 8670,
          tarifa: 0.33,
          impuestoAcumuladoUvt: 788,
        },
        {
          desdeUvt: 8670,
          hastaUvt: 18_970,
          tarifa: 0.35,
          impuestoAcumuladoUvt: 2296,
        },
        {
          desdeUvt: 18_970,
          hastaUvt: 31_000,
          tarifa: 0.37,
          impuestoAcumuladoUvt: 5901,
        },
        {
          desdeUvt: 31_000,
          hastaUvt: Infinity,
          tarifa: 0.39,
          impuestoAcumuladoUvt: 10_352,
        },
      ],
      fuente: {
        articulo: 'ET art. 241',
        documento:
          'Estatuto Tributario, art. 241, modificado por la Ley 2277 de 2022, art. 7, y por la Ley 2010 de 2019, art. 34. Siete tramos; 0 % hasta 1.090 UVT; 39 % desde 31.000 UVT.',
        actualizadoAl: ACTUALIZADO_AL,
      },
    },
    rentaExentaLaboral: {
      porcentaje: 0.25,
      topeAnualUvt: 790,
      fuente: {
        articulo: 'ET art. 206 num. 10',
        documento:
          'Estatuto Tributario, art. 206 numeral 10, modificado por la Ley 2277 de 2022, art. 2. Se calcula después de restar ingresos no constitutivos, deducciones y las demás rentas exentas distintas de este numeral.',
        actualizadoAl: ACTUALIZADO_AL,
      },
    },
    limiteExentasDeducciones: {
      porcentaje: 0.4,
      topeAnualUvt: 1340,
      fuente: {
        articulo: 'ET art. 336 num. 3 inc. 1',
        documento:
          'Estatuto Tributario, art. 336 numeral 3, modificado por la Ley 2277 de 2022, art. 7. El 40 % se aplica sobre el ingreso neto (ingresos menos no constitutivos).',
        actualizadoAl: ACTUALIZADO_AL,
      },
    },
    dependientesAdicionales: {
      uvtPorDependiente: 72,
      maxDependientes: 4,
      fuente: {
        articulo: 'ET art. 336 num. 3 inc. 2',
        documento:
          'Estatuto Tributario, art. 336 numeral 3 inciso 2, adicionado por la Ley 2277 de 2022, art. 7. Va por fuera del tope del 40 % y de 1.340 UVT, y es adicional a la deducción del art. 387.',
        actualizadoAl: ACTUALIZADO_AL,
      },
    },
  },
  retencion: {
    tabla383: {
      tramos: [
        {
          desdeUvt: 0,
          hastaUvt: 95,
          tarifa: 0,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 95,
          hastaUvt: 150,
          tarifa: 0.19,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 150,
          hastaUvt: 360,
          tarifa: 0.28,
          impuestoAcumuladoUvt: 10,
        },
        {
          desdeUvt: 360,
          hastaUvt: 640,
          tarifa: 0.33,
          impuestoAcumuladoUvt: 69,
        },
        {
          desdeUvt: 640,
          hastaUvt: 945,
          tarifa: 0.35,
          impuestoAcumuladoUvt: 162,
        },
        {
          desdeUvt: 945,
          hastaUvt: 2300,
          tarifa: 0.37,
          impuestoAcumuladoUvt: 268,
        },
        {
          desdeUvt: 2300,
          hastaUvt: Infinity,
          tarifa: 0.39,
          impuestoAcumuladoUvt: 770,
        },
      ],
      fuente: {
        articulo: 'ET art. 383',
        documento:
          'Estatuto Tributario, art. 383, modificado por la Ley 2010 de 2019, art. 42, y por la Ley 2277 de 2022, art. 8 (parágrafo 2). Procedimiento 1: ET art. 385.',
        actualizadoAl: ACTUALIZADO_AL,
      },
    },
  },
  salud: {
    tarifaEmpleado: 0.04,
    tarifaEmpleador: 0.085,
    tarifaIndependiente: 0.125,
    fuente: {
      articulo: 'Ley 100 de 1993, art. 204',
      documento:
        'Ley 100 de 1993, art. 204. Cotización total 12,5 %: empleador 8,5 %, empleado 4 %. Independientes pagan el 12,5 %. Pensionados: tabla propia del parágrafo 5 (no es este módulo).',
      actualizadoAl: ACTUALIZADO_AL,
    },
  },
  aportesPatronales: {
    exoneracionMenosDeSmlmv: 10,
    fuente: {
      articulo: 'ET art. 114-1',
      documento:
        'Estatuto Tributario, art. 114-1, adicionado por la Ley 1819 de 2016, art. 65. Exonera SENA, ICBF y cotización patronal de salud por trabajadores que devenguen menos de 10 SMLMV. Personas naturales: no aplica si emplean menos de dos trabajadores.',
      actualizadoAl: ACTUALIZADO_AL,
    },
  },
  patrimonio: {
    umbralUvt: 72_000,
    tabla2026: {
      tramos: [
        {
          desdeUvt: 0,
          hastaUvt: 72_000,
          tarifa: 0,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 72_000,
          hastaUvt: 122_000,
          tarifa: 0.005,
          impuestoAcumuladoUvt: 0,
        },
        {
          desdeUvt: 122_000,
          hastaUvt: 239_000,
          tarifa: 0.01,
          impuestoAcumuladoUvt: 250,
        },
        {
          desdeUvt: 239_000,
          hastaUvt: Infinity,
          tarifa: 0.015,
          impuestoAcumuladoUvt: 1420,
        },
      ],
      fuente: {
        articulo: 'ET art. 294-3 y art. 296-3',
        documento:
          'Estatuto Tributario, arts. 294-3 y 296-3, Ley 2277 de 2022, arts. 36 y 38. El 1,5 % del último tramo solo aplica 2023-2026. Desde 2027, sin reforma, el máximo vigente sería 1 % desde 122.000 UVT.',
        actualizadoAl: ACTUALIZADO_AL,
      },
    },
  },
} as const;

export type ParametrosVigente = typeof vigente;
