import { RegimenTributario } from './entrada';
import { proyecto } from './params/proyecto';
import { vigente } from './params/vigente';
import { calcularRenta } from './renta';
import { proyectarRetencion } from './retencion';
import { calcularAportes } from './salario';

import type { EntradaLaboral } from './entrada';
import type { ResultadoRenta } from './renta';
import type { ProyeccionRetencion, ResultadoRetencion } from './retencion';
import type { ResultadoAportes } from './salario';

export interface ResultadoEscenarioLaboral {
  readonly regimen: RegimenTributario;
  readonly aportes: ResultadoAportes;
  readonly retencion: ResultadoRetencion;
  readonly renta: ResultadoRenta;
  readonly netoMensual: number;
  readonly netoMensualTrasAgotarCupos: number;
  readonly proyeccionRetencion: ProyeccionRetencion;
}

export interface ComparacionLaboral {
  readonly vigente: ResultadoEscenarioLaboral;
  readonly proyecto: ResultadoEscenarioLaboral;
  readonly diferenciaAportesMensual: number;
  readonly diferenciaRetencionMensual: number;
  readonly diferenciaNetoMensual: number;
  readonly diferenciaRentaAnual: number;
}

/**
 * Escenario laboral completo: aportes, retención de enero (con cupo) e
 * impuesto anual. `proyeccionRetencion` arrastra los cupos del 25 % y del
 * tope global mes a mes. El neto mensual usa la retención con cupo; el
 * neto tras agotar cupos usa el mes 12.
 */
export function calcularEscenarioLaboral(
  entrada: EntradaLaboral,
  regimen: RegimenTributario,
): ResultadoEscenarioLaboral {
  const params = regimen === RegimenTributario.VIGENTE ? vigente : proyecto;
  const aportes = calcularAportes(entrada, params.salud);
  const proyeccionRetencion = proyectarRetencion(
    entrada,
    aportes.total,
    params.retencion,
    params.renta,
  );
  const retencion = proyeccionRetencion.retencionConCupo;
  const renta = calcularRenta(entrada, aportes.total, params.renta);
  const salarioMasAuxilio =
    Math.max(0, entrada.salarioMensual) + aportes.auxilioTransporte;
  const netoMensual = salarioMasAuxilio - aportes.total - retencion.total;
  const netoMensualTrasAgotarCupos =
    salarioMasAuxilio
    - aportes.total
    - proyeccionRetencion.retencionTrasAgotarCupos.total;

  return {
    regimen,
    aportes,
    retencion,
    renta,
    netoMensual,
    netoMensualTrasAgotarCupos,
    proyeccionRetencion,
  };
}

/**
 * Compara vigente y proyecto con los mismos UVT y SMLMV, para que la
 * diferencia venga solo de la norma. No usa las tarifas del FSP de la Ley 2381.
 */
export function compararLaboral(entrada: EntradaLaboral): ComparacionLaboral {
  const escenarioVigente = calcularEscenarioLaboral(
    entrada,
    RegimenTributario.VIGENTE,
  );
  const escenarioProyecto = calcularEscenarioLaboral(
    entrada,
    RegimenTributario.PROYECTO,
  );

  return {
    vigente: escenarioVigente,
    proyecto: escenarioProyecto,
    diferenciaAportesMensual:
      escenarioProyecto.aportes.total - escenarioVigente.aportes.total,
    diferenciaRetencionMensual:
      escenarioProyecto.retencion.total - escenarioVigente.retencion.total,
    diferenciaNetoMensual:
      escenarioProyecto.netoMensual - escenarioVigente.netoMensual,
    diferenciaRentaAnual:
      escenarioProyecto.renta.total - escenarioVigente.renta.total,
  };
}
