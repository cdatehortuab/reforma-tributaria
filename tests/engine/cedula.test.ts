import { describe, expect, it } from 'vitest';

import {
  cuposCedulaIniciales,
  DEDUCCION_DEPENDIENTES_ART_387,
  DEDUCCION_SALUD_ART_387,
  depurarCedula,
  INTERESES_VIVIENDA,
  PeriodoCedula,
  proyecto,
  RENTA_EXENTA_APORTES_VOLUNTARIOS,
  UVT_2026,
  vigente,
} from '../../src/engine';

const uvt = UVT_2026.valor;

describe('depurarCedula mensual (retención, art. 388)', () => {
  it('calcula el 25 % sobre el ingreso neto y no rebasa el cupo anual restante', () => {
    const resultado = depurarCedula(
      {
        ingresos: 10_000_000,
        incrgo: 800_000,
        personasACargo: 0,
        interesesVivienda: 0,
        medicinaPrepagada: 0,
        aportesVoluntariosPensionAfc: 0,
        periodo: PeriodoCedula.MENSUAL,
      },
      vigente.renta,
    );

    expect(resultado.ingresoNeto).toBe(9_200_000);
    expect(resultado.rentaExentaLaboral25).toBe(Math.round(9_200_000 * 0.25));
    expect(resultado.deduccionDependientesArt336).toBe(0);
    expect(resultado.ajustePorLimite).toBe(0);
    expect(resultado.baseGravable).toBe(
      9_200_000 - Math.round(9_200_000 * 0.25),
    );
  });

  it('aplica el 10 % por dependientes con tope de 32 UVT, no los 72 UVT', () => {
    const ingresos = 20_000_000;
    const resultado = depurarCedula(
      {
        ingresos,
        incrgo: 1_000_000,
        personasACargo: 3,
        interesesVivienda: 0,
        medicinaPrepagada: 0,
        aportesVoluntariosPensionAfc: 0,
        periodo: PeriodoCedula.MENSUAL,
      },
      vigente.renta,
    );

    expect(resultado.deduccionDependientesArt387).toBe(
      Math.round(DEDUCCION_DEPENDIENTES_ART_387.topeMensualUvt * uvt),
    );
    expect(resultado.deduccionDependientesArt336).toBe(0);
  });

  it('recorta vivienda y prepagada a 100 y 16 UVT', () => {
    const resultado = depurarCedula(
      {
        ingresos: 15_000_000,
        incrgo: 1_000_000,
        personasACargo: 0,
        interesesVivienda: 20_000_000,
        medicinaPrepagada: 5_000_000,
        aportesVoluntariosPensionAfc: 0,
        periodo: PeriodoCedula.MENSUAL,
      },
      vigente.renta,
    );

    expect(resultado.deduccionInteresesVivienda).toBe(
      Math.round(INTERESES_VIVIENDA.topeMensualUvt * uvt),
    );
    expect(resultado.deduccionMedicinaPrepagada).toBe(
      Math.round(DEDUCCION_SALUD_ART_387.topeMensualUvt * uvt),
    );
  });

  it('trata los aportes voluntarios/AFC como renta exenta sujeta al 40 %', () => {
    const ingresos = 10_000_000;
    const resultado = depurarCedula(
      {
        ingresos,
        incrgo: 800_000,
        personasACargo: 0,
        interesesVivienda: 0,
        medicinaPrepagada: 0,
        aportesVoluntariosPensionAfc: 8_000_000,
        periodo: PeriodoCedula.MENSUAL,
      },
      vigente.renta,
    );

    const topePorcentaje = Math.round(
      ingresos * RENTA_EXENTA_APORTES_VOLUNTARIOS.porcentajeIngresoLaboral,
    );
    const cupoAnualAfc = Math.round(
      RENTA_EXENTA_APORTES_VOLUNTARIOS.topeAnualUvt * uvt,
    );

    expect(resultado.rentaExentaAportesVoluntarios).toBe(
      Math.min(8_000_000, topePorcentaje, cupoAnualAfc),
    );
    expect(resultado.ajustePorLimite).toBeGreaterThan(0);
    expect(resultado.permitidoPorLimite).toBe(Math.round(9_200_000 * 0.4));
  });

  it('usa el cupo anual restante del 25 % y del tope global, no el prorrateo ÷ 12', () => {
    const ingresoNeto = 50_000_000;
    const resultado = depurarCedula(
      {
        ingresos: ingresoNeto + 4_000_000,
        incrgo: 4_000_000,
        personasACargo: 0,
        interesesVivienda: 0,
        medicinaPrepagada: 0,
        aportesVoluntariosPensionAfc: 0,
        periodo: PeriodoCedula.MENSUAL,
      },
      vigente.renta,
    );

    const tope1340 = Math.round(
      vigente.renta.limiteExentasDeducciones.topeAnualUvt * uvt,
    );
    const tope790 = Math.round(
      vigente.renta.rentaExentaLaboral.topeAnualUvt * uvt,
    );
    expect(resultado.rentaExentaLaboral25).toBe(Math.round(ingresoNeto * 0.25));
    expect(resultado.rentaExentaLaboral25).toBeLessThan(tope790);
    expect(resultado.permitidoPorLimite).not.toBe(Math.round(tope1340 / 12));
    expect(resultado.permitidoPorLimite).toBe(resultado.rentaExentaLaboral25);
    expect(resultado.cuposRestantes.rentaExentaLaboral25).toBe(
      tope790 - resultado.rentaExentaLaboral25,
    );
    expect(resultado.cuposRestantes.limiteGlobal).toBe(
      tope1340 - resultado.permitidoPorLimite,
    );
  });

  it('deja el 25 % en cero cuando el cupo restante ya se agotó', () => {
    const cupos = cuposCedulaIniciales(vigente.renta);
    const resultado = depurarCedula(
      {
        ingresos: 20_000_000,
        incrgo: 1_000_000,
        personasACargo: 0,
        interesesVivienda: 0,
        medicinaPrepagada: 0,
        aportesVoluntariosPensionAfc: 0,
        periodo: PeriodoCedula.MENSUAL,
      },
      vigente.renta,
      { ...cupos, rentaExentaLaboral25: 0 },
    );

    expect(resultado.rentaExentaLaboral25).toBe(0);
    expect(resultado.baseGravable).toBe(19_000_000);
    expect(resultado.cuposRestantes.rentaExentaLaboral25).toBe(0);
  });

  it('recorta al cupo global restante aunque el 40 % del mes aún dé margen', () => {
    const cupos = cuposCedulaIniciales(vigente.renta);
    const resultado = depurarCedula(
      {
        ingresos: 20_000_000,
        incrgo: 1_000_000,
        personasACargo: 0,
        interesesVivienda: 0,
        medicinaPrepagada: 0,
        aportesVoluntariosPensionAfc: 0,
        periodo: PeriodoCedula.MENSUAL,
      },
      vigente.renta,
      { ...cupos, limiteGlobal: 1_000_000 },
    );

    expect(resultado.permitidoPorLimite).toBe(1_000_000);
    expect(resultado.ajustePorLimite).toBeGreaterThan(0);
    expect(resultado.cuposRestantes.limiteGlobal).toBe(0);
  });

  it('sigue aplicando el 40 % de ese mes aunque el cupo global aún sea enorme', () => {
    const resultado = depurarCedula(
      {
        ingresos: 10_000_000,
        incrgo: 800_000,
        personasACargo: 0,
        interesesVivienda: 0,
        medicinaPrepagada: 0,
        aportesVoluntariosPensionAfc: 8_000_000,
        periodo: PeriodoCedula.MENSUAL,
      },
      vigente.renta,
    );

    expect(resultado.permitidoPorLimite).toBe(Math.round(9_200_000 * 0.4));
  });
});

describe('depurarCedula anual (arts. 206 y 336)', () => {
  it('resta 72 UVT por dependiente fuera del tope, hasta 4, solo en vigente', () => {
    const entrada = {
      ingresos: 120_000_000,
      incrgo: 10_000_000,
      personasACargo: 4,
      interesesVivienda: 0,
      medicinaPrepagada: 0,
      aportesVoluntariosPensionAfc: 0,
      periodo: PeriodoCedula.ANUAL,
    };
    const hoy = depurarCedula(entrada, vigente.renta);
    const reforma = depurarCedula(entrada, proyecto.renta);

    expect(hoy.deduccionDependientesArt336).toBe(Math.round(72 * 4 * uvt));
    expect(reforma.deduccionDependientesArt336).toBe(0);
    expect(hoy.baseGravable).toBeLessThan(reforma.baseGravable);
  });

  it('baja el tope del 25 % de 790 a 630 UVT', () => {
    const ingresosAltos = 400_000_000;
    const hoy = depurarCedula(
      {
        ingresos: ingresosAltos,
        incrgo: 20_000_000,
        personasACargo: 0,
        interesesVivienda: 0,
        medicinaPrepagada: 0,
        aportesVoluntariosPensionAfc: 0,
        periodo: PeriodoCedula.ANUAL,
      },
      vigente.renta,
    );
    const reforma = depurarCedula(
      {
        ingresos: ingresosAltos,
        incrgo: 20_000_000,
        personasACargo: 0,
        interesesVivienda: 0,
        medicinaPrepagada: 0,
        aportesVoluntariosPensionAfc: 0,
        periodo: PeriodoCedula.ANUAL,
      },
      proyecto.renta,
    );

    expect(hoy.rentaExentaLaboral25).toBe(Math.round(790 * uvt));
    expect(reforma.rentaExentaLaboral25).toBe(Math.round(630 * uvt));
  });

  it('baja el tope conjunto de 1.340 a 1.180 UVT cuando el 40 % no es el menor', () => {
    const ingresos = 400_000_000;
    const incrgo = 10_000_000;
    const extras = {
      ingresos,
      incrgo,
      personasACargo: 1,
      interesesVivienda: 80_000_000,
      medicinaPrepagada: 20_000_000,
      aportesVoluntariosPensionAfc: 0,
      periodo: PeriodoCedula.ANUAL,
    };
    const hoy = depurarCedula(extras, vigente.renta);
    const reforma = depurarCedula(extras, proyecto.renta);
    const ingresoNeto = ingresos - incrgo;
    const tope40 = Math.round(ingresoNeto * 0.4);

    expect(tope40).toBeGreaterThan(Math.round(1340 * uvt));
    expect(hoy.permitidoPorLimite).toBe(Math.round(1340 * uvt));
    expect(reforma.permitidoPorLimite).toBe(Math.round(1180 * uvt));
  });
});
