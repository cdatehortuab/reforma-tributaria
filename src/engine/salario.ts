import { aPesos, noNegativo } from './dinero';
import { TipoSalario } from './entrada';
import {
  AUXILIO_TRANSPORTE_2026,
  COTIZACION_PENSION,
  FONDO_SOLIDARIDAD_PENSIONAL_VIGENTE,
  IBC_TOPE_SMLMV,
  SALARIO_INTEGRAL_BASE_COTIZACION,
  SMLMV_2026,
} from './params/constants';
import { consolidarResultado } from './resultado';
import { BordeHastaSmlmv, buscarTramoSmlmv } from './tramos';

import type { EntradaLaboral } from './entrada';
import type { FuenteParametro, TramoSmlmv } from './params/constants';
import type { ResultadoCalculo } from './resultado';

export interface ParametrosSaludPlana {
  readonly tarifaEmpleado: number;
  readonly tarifaEmpleador: number;
  readonly tarifaIndependiente: number;
  readonly fuente: FuenteParametro;
}

export interface ParametrosSaludPorTramos {
  readonly tarifaEmpleador: number;
  readonly tramosEmpleado: readonly TramoSmlmv[];
  readonly tramosIndependiente: readonly TramoSmlmv[];
  readonly fuente: FuenteParametro;
}

export type ParametrosSalud = ParametrosSaludPlana | ParametrosSaludPorTramos;

export function isSaludPorTramos(
  params: ParametrosSalud,
): params is ParametrosSaludPorTramos {
  return 'tramosEmpleado' in params;
}

export interface ResultadoAportes extends ResultadoCalculo {
  readonly ibc: number;
  readonly ibcSmlmv: number;
  readonly tarifaSalud: number;
  readonly salud: number;
  readonly pension: number;
  readonly fsp: number;
  readonly auxilioTransporte: number;
}

/**
 * Aportes del trabajador (salud, pensión y FSP) sobre el IBC.
 * El IBC del salario integral es el 70 % (CST art. 132), con tope de 25 SMLMV.
 * La tarifa de salud del PL 477 se mira sobre el IBC en SMLMV, no sobre el
 * salario bruto: la tabla llega hasta 25, que es el tope del IBC.
 */
export function calcularAportes(
  entrada: EntradaLaboral,
  salud: ParametrosSalud,
): ResultadoAportes {
  const salario = noNegativo(entrada.salarioMensual);
  const ibc = calcularIbc(salario, entrada.tipoSalario);
  const ibcSmlmv = ibc / SMLMV_2026.valor;
  const tarifaSalud = tarifaSaludEmpleado(ibcSmlmv, salud);
  const tarifaFsp = tarifaFondoSolidaridad(ibcSmlmv);

  const saludPesos = aPesos(ibc * tarifaSalud);
  const pensionPesos = aPesos(ibc * COTIZACION_PENSION.tarifaEmpleado);
  const fspPesos = aPesos(ibc * tarifaFsp);
  const auxilioTransporte = auxilioSiAplica(salario, entrada.tipoSalario);

  const { total, lineas } = consolidarResultado([
    {
      concepto: 'Salud del trabajador',
      valor: saludPesos,
      articulo: salud.fuente.articulo,
      explicacion: explicacionSalud(tarifaSalud, salud),
    },
    {
      concepto: 'Pensión del trabajador',
      valor: pensionPesos,
      articulo: COTIZACION_PENSION.fuente.articulo,
      explicacion:
        'El 4 % del ingreso base de cotización. El PL 477 no cambia esta tarifa.',
    },
    {
      concepto: 'Fondo de Solidaridad Pensional',
      valor: fspPesos,
      articulo: FONDO_SOLIDARIDAD_PENSIONAL_VIGENTE.fuente.articulo,
      explicacion: explicacionFsp(tarifaFsp),
    },
  ]);

  return {
    total,
    lineas,
    ibc,
    ibcSmlmv,
    tarifaSalud,
    salud: saludPesos,
    pension: pensionPesos,
    fsp: fspPesos,
    auxilioTransporte,
  };
}

export function calcularIbc(
  salarioMensual: number,
  tipoSalario: EntradaLaboral['tipoSalario'],
): number {
  const base =
    tipoSalario === TipoSalario.INTEGRAL ?
      salarioMensual * SALARIO_INTEGRAL_BASE_COTIZACION.valor
    : salarioMensual;
  const tope = IBC_TOPE_SMLMV.valor * SMLMV_2026.valor;

  return aPesos(Math.min(noNegativo(base), tope));
}

function tarifaSaludEmpleado(ibcSmlmv: number, salud: ParametrosSalud): number {
  if (!isSaludPorTramos(salud)) {
    return salud.tarifaEmpleado;
  }

  const tramo = buscarTramoSmlmv(
    ibcSmlmv,
    salud.tramosEmpleado,
    BordeHastaSmlmv.INCLUSIVO,
  );
  return tramo?.tarifa ?? 0;
}

function tarifaFondoSolidaridad(ibcSmlmv: number): number {
  const tramo = buscarTramoSmlmv(
    ibcSmlmv,
    FONDO_SOLIDARIDAD_PENSIONAL_VIGENTE.tramos,
    BordeHastaSmlmv.EXCLUSIVO,
  );
  return tramo?.tarifa ?? 0;
}

function auxilioSiAplica(
  salarioMensual: number,
  tipoSalario: EntradaLaboral['tipoSalario'],
): number {
  if (tipoSalario === TipoSalario.INTEGRAL) {
    return 0;
  }

  const tope = 2 * SMLMV_2026.valor;
  return salarioMensual > 0 && salarioMensual <= tope ?
      AUXILIO_TRANSPORTE_2026.valor
    : 0;
}

function explicacionSalud(tarifa: number, salud: ParametrosSalud): string {
  const porcentaje = formatoPorcentaje(tarifa);
  return isSaludPorTramos(salud) ?
      `Tarifa del ${porcentaje} del IBC, según el tramo en SMLMV del proyecto de ley.`
    : `Tarifa plana del ${porcentaje} del IBC (Ley 100 art. 204).`;
}

function explicacionFsp(tarifa: number): string {
  return tarifa === 0 ?
      'No aplica por debajo de 4 SMLMV de IBC. El PL 477 no toca este fondo.'
    : `Tarifa del ${formatoPorcentaje(tarifa)} del IBC desde 4 SMLMV. El PL 477 no toca este fondo; la Ley 2381 no entra en esta comparación.`;
}

function formatoPorcentaje(tarifa: number): string {
  const puntos = tarifa * 100;
  const texto =
    Number.isSafeInteger(puntos) ? puntos.toFixed(0) : puntos.toString();
  return `${texto} %`;
}
