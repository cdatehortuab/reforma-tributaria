import { aPesos, noNegativo, topeUvtAPesos } from './dinero';
import {
  DEDUCCION_DEPENDIENTES_ART_387,
  DEDUCCION_SALUD_ART_387,
  INTERESES_VIVIENDA,
  MESES_DEL_ANIO,
  RENTA_EXENTA_APORTES_VOLUNTARIOS,
  UVT_2026,
} from './params/constants';

import type { FuenteParametro } from './params/constants';
import type { LineaCalculo } from './resultado';

export const PeriodoCedula = {
  MENSUAL: 'mensual',
  ANUAL: 'anual',
} as const;

export type PeriodoCedula = (typeof PeriodoCedula)[keyof typeof PeriodoCedula];

export interface ParametrosCedula {
  readonly rentaExentaLaboral: {
    readonly porcentaje: number;
    readonly topeAnualUvt: number;
    readonly fuente: FuenteParametro;
  };
  readonly limiteExentasDeducciones: {
    readonly porcentaje: number;
    readonly topeAnualUvt: number;
    readonly fuente: FuenteParametro;
  };
  readonly dependientesAdicionales: {
    readonly uvtPorDependiente: number;
    readonly maxDependientes: number;
    readonly fuente: FuenteParametro;
  };
}

export interface EntradaCedula {
  readonly ingresos: number;
  readonly incrgo: number;
  readonly personasACargo: number;
  readonly interesesVivienda: number;
  readonly medicinaPrepagada: number;
  readonly aportesVoluntariosPensionAfc: number;
  readonly periodo: PeriodoCedula;
}

export interface CuposCedula {
  readonly rentaExentaLaboral25: number;
  readonly limiteGlobal: number;
  readonly aportesVoluntarios: number;
}

export interface ResultadoCedula {
  readonly ingresos: number;
  readonly incrgo: number;
  readonly ingresoNeto: number;
  readonly deduccionDependientesArt387: number;
  readonly deduccionInteresesVivienda: number;
  readonly deduccionMedicinaPrepagada: number;
  readonly rentaExentaAportesVoluntarios: number;
  readonly rentaExentaLaboral25: number;
  readonly sujetosALimite: number;
  readonly permitidoPorLimite: number;
  readonly ajustePorLimite: number;
  readonly deduccionDependientesArt336: number;
  readonly baseGravable: number;
  readonly cuposRestantes: CuposCedula;
  readonly lineas: readonly LineaCalculo[];
}

/** Cupos anuales llenos (790/630 UVT, 1.340/1.180 UVT y 3.800 UVT de AFC). */
export function cuposCedulaIniciales(params: ParametrosCedula): CuposCedula {
  const uvt = UVT_2026.valor;
  return {
    rentaExentaLaboral25: topeUvtAPesos(
      params.rentaExentaLaboral.topeAnualUvt,
      uvt,
    ),
    limiteGlobal: topeUvtAPesos(
      params.limiteExentasDeducciones.topeAnualUvt,
      uvt,
    ),
    aportesVoluntarios: topeUvtAPesos(
      RENTA_EXENTA_APORTES_VOLUNTARIOS.topeAnualUvt,
      uvt,
    ),
  };
}

/**
 * Depura la base de la cédula general / de la retención.
 *
 * Orden (ET arts. 206 num. 10, 336, 387 y 388):
 * 1. Restar ingresos no constitutivos (aportes obligatorios).
 * 2. Restar deducciones del art. 387 (dependientes 10 %, vivienda, prepagada).
 * 3. Restar otras rentas exentas (aportes voluntarios y AFC, art. 126-1).
 * 4. Calcular el 25 % laboral sobre lo que queda, con tope en UVT.
 * 5. Limitar la suma de deducciones y exentas al 40 % del ingreso neto
 *    y al cupo anual restante del tope global (1.340 / 1.180 UVT).
 *    En retención ese cupo se arrastra mes a mes: lo restado en enero
 *    reduce lo disponible en febrero. El 40 % del art. 388 sigue siendo
 *    de cada mes. Los topes propios del art. 387 (32, 100 y 16 UVT) también.
 * 6. En la declaración, restar además 72 UVT por dependiente (art. 336),
 *    fuera de ese tope. En retención no procede (art. 388 remite al 387).
 */
export function depurarCedula(
  entrada: EntradaCedula,
  params: ParametrosCedula,
  cuposRestantes: CuposCedula = cuposCedulaIniciales(params),
): ResultadoCedula {
  const uvt = UVT_2026.valor;
  const isAnual = entrada.periodo === PeriodoCedula.ANUAL;
  const meses = isAnual ? MESES_DEL_ANIO : 1;
  const cupos = isAnual ? cuposCedulaIniciales(params) : cuposRestantes;
  const ingresos = aPesos(noNegativo(entrada.ingresos));
  const incrgo = aPesos(noNegativo(entrada.incrgo));
  const ingresoNeto = noNegativo(ingresos - incrgo);
  const dependientes = dependientesEnteros(entrada.personasACargo);

  const deduccionDependientesArt387 = deduccionArt387(
    dependientes,
    ingresos,
    meses,
    uvt,
  );
  const deduccionInteresesVivienda = menorDe([
    aPesos(noNegativo(entrada.interesesVivienda)),
    topeUvtAPesos(INTERESES_VIVIENDA.topeMensualUvt * meses, uvt),
  ]);
  const deduccionMedicinaPrepagada = menorDe([
    aPesos(noNegativo(entrada.medicinaPrepagada)),
    topeUvtAPesos(DEDUCCION_SALUD_ART_387.topeMensualUvt * meses, uvt),
  ]);
  const rentaExentaAportesVoluntarios = rentaExentaVoluntarios(
    ingresos,
    entrada.aportesVoluntariosPensionAfc,
    cupos.aportesVoluntarios,
  );

  const deducciones =
    deduccionDependientesArt387
    + deduccionInteresesVivienda
    + deduccionMedicinaPrepagada;
  const base25 = noNegativo(
    ingresoNeto - deducciones - rentaExentaAportesVoluntarios,
  );
  const rentaExentaLaboral25 = menorDe([
    aPesos(base25 * params.rentaExentaLaboral.porcentaje),
    cupos.rentaExentaLaboral25,
  ]);

  const sujetosALimite =
    deducciones + rentaExentaAportesVoluntarios + rentaExentaLaboral25;
  const tope40 = aPesos(
    ingresoNeto * params.limiteExentasDeducciones.porcentaje,
  );
  const permitidoPorLimite = menorDe([
    sujetosALimite,
    tope40,
    cupos.limiteGlobal,
  ]);
  const ajustePorLimite = sujetosALimite - permitidoPorLimite;
  const aplicados = asignarRecorte(
    rentaExentaLaboral25,
    rentaExentaAportesVoluntarios,
    deducciones,
    ajustePorLimite,
  );
  const cuposTrasMes: CuposCedula = {
    rentaExentaLaboral25: noNegativo(
      cupos.rentaExentaLaboral25 - aplicados.renta25,
    ),
    aportesVoluntarios: noNegativo(cupos.aportesVoluntarios - aplicados.afc),
    limiteGlobal: noNegativo(cupos.limiteGlobal - permitidoPorLimite),
  };

  const deduccionDependientesArt336 =
    entrada.periodo === PeriodoCedula.ANUAL ?
      deduccionArt336(dependientes, params, uvt)
    : 0;

  const baseGravable = noNegativo(
    ingresoNeto - permitidoPorLimite - deduccionDependientesArt336,
  );

  return {
    ingresos,
    incrgo,
    ingresoNeto,
    deduccionDependientesArt387,
    deduccionInteresesVivienda,
    deduccionMedicinaPrepagada,
    rentaExentaAportesVoluntarios,
    rentaExentaLaboral25,
    sujetosALimite,
    permitidoPorLimite,
    ajustePorLimite,
    deduccionDependientesArt336,
    baseGravable,
    cuposRestantes: cuposTrasMes,
    lineas: lineasCedula({
      ingresos,
      incrgo,
      deduccionDependientesArt387,
      deduccionInteresesVivienda,
      deduccionMedicinaPrepagada,
      rentaExentaAportesVoluntarios,
      rentaExentaLaboral25,
      ajustePorLimite,
      deduccionDependientesArt336,
      baseGravable,
      params,
      periodo: entrada.periodo,
    }),
  };
}

export function dependientesEnteros(personasACargo: number): number {
  return Number.isFinite(personasACargo) ?
      Math.max(0, Math.trunc(personasACargo))
    : 0;
}

function deduccionArt387(
  dependientes: number,
  ingresos: number,
  meses: number,
  uvt: number,
): number {
  if (dependientes < 1) {
    return 0;
  }

  const topeUvt =
    meses === MESES_DEL_ANIO ?
      DEDUCCION_DEPENDIENTES_ART_387.topeAnualUvt
    : DEDUCCION_DEPENDIENTES_ART_387.topeMensualUvt;

  return menorDe([
    aPesos(ingresos * DEDUCCION_DEPENDIENTES_ART_387.porcentajeIngresosBrutos),
    topeUvtAPesos(topeUvt, uvt),
  ]);
}

function deduccionArt336(
  dependientes: number,
  params: ParametrosCedula,
  uvt: number,
): number {
  const topePersonas = Math.max(
    0,
    params.dependientesAdicionales.maxDependientes,
  );
  const personas = Math.min(dependientes, topePersonas);

  return topeUvtAPesos(
    personas * params.dependientesAdicionales.uvtPorDependiente,
    uvt,
  );
}

function rentaExentaVoluntarios(
  ingresos: number,
  aportes: number,
  cupoRestante: number,
): number {
  const topePorcentaje = aPesos(
    ingresos * RENTA_EXENTA_APORTES_VOLUNTARIOS.porcentajeIngresoLaboral,
  );
  return menorDe([aPesos(noNegativo(aportes)), topePorcentaje, cupoRestante]);
}

/**
 * Si el 40 % o el cupo global recortan, se pierde primero el 25 % (el último
 * que se calcula), luego los voluntarios/AFC y al final las deducciones 387.
 */
function asignarRecorte(
  renta25: number,
  afc: number,
  deducciones: number,
  recorte: number,
): { renta25: number; afc: number; deducciones: number } {
  const renta25Aplicada = noNegativo(renta25 - recorte);
  const recorteTras25 = noNegativo(recorte - renta25);
  const afcAplicada = noNegativo(afc - recorteTras25);
  const recorteTrasAfc = noNegativo(recorteTras25 - afc);
  return {
    renta25: renta25Aplicada,
    afc: afcAplicada,
    deducciones: noNegativo(deducciones - recorteTrasAfc),
  };
}

function menorDe(valores: readonly number[]): number {
  const primero = valores[0];
  return primero === undefined ? 0 : Math.min(primero, ...valores.slice(1));
}

function lineasCedula(args: {
  readonly ingresos: number;
  readonly incrgo: number;
  readonly deduccionDependientesArt387: number;
  readonly deduccionInteresesVivienda: number;
  readonly deduccionMedicinaPrepagada: number;
  readonly rentaExentaAportesVoluntarios: number;
  readonly rentaExentaLaboral25: number;
  readonly ajustePorLimite: number;
  readonly deduccionDependientesArt336: number;
  readonly baseGravable: number;
  readonly params: ParametrosCedula;
  readonly periodo: PeriodoCedula;
}): readonly LineaCalculo[] {
  const lineas: LineaCalculo[] = [
    {
      concepto: 'Ingresos laborales',
      valor: args.ingresos,
      articulo: 'ET art. 103',
      explicacion:
        args.periodo === PeriodoCedula.ANUAL ?
          'Salario mensual × 12. No incluye prima ni cesantías (estimación del mes típico).'
        : 'Pagos laborales del mes, sin auxilio de transporte.',
    },
    {
      concepto: 'Ingresos no constitutivos',
      valor: -args.incrgo,
      articulo: 'ET arts. 55 y 56',
      explicacion:
        'Aportes obligatorios a salud, pensión y Fondo de Solidaridad Pensional a cargo del trabajador.',
    },
    {
      concepto: 'Deducción por dependientes (art. 387)',
      valor: -args.deduccionDependientesArt387,
      articulo: DEDUCCION_DEPENDIENTES_ART_387.fuente.articulo,
      explicacion:
        '10 % del ingreso laboral bruto si hay personas a cargo, con tope de 32 UVT al mes. El PL 477 no la deroga.',
    },
    {
      concepto: 'Intereses de vivienda',
      valor: -args.deduccionInteresesVivienda,
      articulo: INTERESES_VIVIENDA.fuente.articulo,
      explicacion:
        'Intereses de crédito de vivienda, hasta 100 UVT al mes (1.200 UVT al año).',
    },
    {
      concepto: 'Medicina prepagada / póliza de salud',
      valor: -args.deduccionMedicinaPrepagada,
      articulo: DEDUCCION_SALUD_ART_387.fuente.articulo,
      explicacion: 'Hasta 16 UVT al mes.',
    },
    {
      concepto: 'Renta exenta por aportes voluntarios y AFC',
      valor: -args.rentaExentaAportesVoluntarios,
      articulo: RENTA_EXENTA_APORTES_VOLUNTARIOS.fuente.articulo,
      explicacion:
        'Hasta el 30 % del ingreso laboral y 3.800 UVT al año. Entra al límite del 40 %.',
    },
    {
      concepto: 'Renta exenta laboral 25 %',
      valor: -args.rentaExentaLaboral25,
      articulo: args.params.rentaExentaLaboral.fuente.articulo,
      explicacion: `25 % de lo que queda después de no constitutivos, deducciones y las demás exentas, con tope de ${args.params.rentaExentaLaboral.topeAnualUvt.toString()} UVT al año.`,
    },
  ];

  if (args.ajustePorLimite > 0) {
    lineas.push({
      concepto: 'Ajuste por límite 40 % / tope UVT',
      valor: args.ajustePorLimite,
      articulo:
        args.periodo === PeriodoCedula.ANUAL ?
          args.params.limiteExentasDeducciones.fuente.articulo
        : 'ET art. 388',
      explicacion:
        args.periodo === PeriodoCedula.ANUAL ?
          `La suma de deducciones y exentas no puede superar el 40 % del ingreso neto ni ${args.params.limiteExentasDeducciones.topeAnualUvt.toString()} UVT.`
        : `En retención, el 40 % es de cada mes (art. 388) y el tope de ${args.params.limiteExentasDeducciones.topeAnualUvt.toString()} UVT se arrastra como cupo anual restante.`,
    });
  }

  if (args.periodo === PeriodoCedula.ANUAL) {
    lineas.push({
      concepto: 'Deducción adicional por dependientes (art. 336)',
      valor: -args.deduccionDependientesArt336,
      articulo: args.params.dependientesAdicionales.fuente.articulo,
      explicacion:
        args.params.dependientesAdicionales.uvtPorDependiente > 0 ?
          '72 UVT por persona a cargo, hasta 4, fuera del tope del 40 %. Solo en la declaración, no en la retención.'
        : 'El proyecto de ley deroga los 72 UVT por dependiente.',
    });
  }

  lineas.push({
    concepto:
      args.periodo === PeriodoCedula.ANUAL ?
        'Renta líquida gravable'
      : 'Base de retención',
    valor: args.baseGravable,
    articulo:
      args.periodo === PeriodoCedula.ANUAL ?
        'ET art. 336'
      : 'ET arts. 385 y 388',
    explicacion:
      args.periodo === PeriodoCedula.ANUAL ?
        'Ingreso neto menos las exentas y deducciones permitidas.'
      : 'Ingreso neto del mes menos las exentas y deducciones permitidas. Procedimiento 1.',
  });

  return lineas;
}
